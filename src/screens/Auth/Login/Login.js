import { useState, useRef, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import debounce from "lodash.debounce";
import {
  useWindowDimensions,
  Platform,
  StyleSheet,
  View,
  Image,
  Animated,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import AuthFooterActions from "../../../components/AuthFooterActions";
import { TextInput, Text, useTheme } from "react-native-paper";
import Input from "../../../components/Input";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import KeyboarDismissView from "../../../layouts/KeyboardDismiss";

import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import {
  useLoginMutation,
  useLazyVerifyEmailQuery,
} from "../../../api/auth-api";

const TITLE_DARK = require("../../../../assets/title-dark.png");
const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const emailInputRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const passwordInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordInputPos = useRef(new Animated.Value(windowWidth / 2)).current;

  const [step, setStep] = useState(1);
  const [secretMap, setSecretMap] = useState({
    password: true,
  });

  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult] = useLazyVerifyEmailQuery({
    email,
  });

  useEffect(() => {
    if (verifyResult.isError) {
      const message =
        verifyResult?.error?.data?.message ?? "Sorry an error has occured";
      setError(message);
    }
  }, [verifyResult]);

  useEffect(() => {
    if (loginApiResult.isSuccess) {
      setTokenAndRedirect(loginApiResult.data);
    }
  }, [loginApiResult.isSuccess]);

  const setTokenAndRedirect = async (token) => {
    const { accessToken, refreshToken } = token;
    await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);

    toast.show("Email succesffully updated", {
      type: "success",
      duration: 2500,
      offset: 30,
      animationType: "zoom-in",
      placement: "bottom",
      title: "Login Success!",
    });
    // navigation.navigate("home");
    dispatch(toggleIsAuthenticated(true));
  };

  useEffect(() => {
    if (step === 1) {
      Animated.timing(passwordInputPos, {
        toValue: windowWidth / 2,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(passwordInputPos, {
        toValue: -(windowWidth / 2),
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [step]);

  const handleOnPressPrimary = async () => {
    const nextStep = step === 1 ? 2 : 1;

    setError("");
    if (nextStep === 1) {
      if (password === "") {
        setError("Please enter a password");
      } else {
        const res = await loginApi({ email, password });
        if (res?.error?.status === 400) {
          setError(res.error.data.message);
        }
      }
    } else {
      if (email === "") {
        setError("Please enter an e-mail address");
      } else {
        const res = await verifyTigger({ email });
        passwordInputRef?.current?.focus();
        if (res.isSuccess) {
          setStep(nextStep);
        } else {
          if (res.error.status === 200) {
            setStep(nextStep);
          } else if (res.error.status === 400) {
            setError(res.error.data.message);
          } else if (res.error.status === 404) {
            setError("Email address not found");
          }
        }
      }
    }
  };

  const delayedQuery = useCallback(
    debounce((value) => checkEmail(value), 1000),
    []
  );

  const handleOnChangePassword = (value) => {
    setError("");
    setPassword(value);
  };

  const handleOnChangeEmail = (value) => {
    setError("");
    delayedQuery(value);
    setEmail(value);
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  const handleOnPressSecondary = () => {
    const nextStep = step === 1 ? 2 : 1;
    setError("");
    if (step === 1) {
      navigation.navigate("register");
    } else {
      emailInputRef.current.focus();
      setStep(nextStep);
    }
  };

  const checkEmail = (_value) => {
    if (_value.match(validEmailRegex) === null && _value !== "") {
      setError("You must enter a valid email address");
    }
  };

  return (
    <KeyboarDismissView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={TITLE_DARK}
            resizeMode="contain"
            style={{ height: 80, width: 210 }}
          />
          {step === 1 && (
            <Text variant="bodyMedium">
              Sign in, to unlock your productivity
            </Text>
          )}
          {step === 2 && (
            <Text variant="bodyMedium"> Welcome back, {email}!</Text>
          )}
        </View>
        <Animated.View
          style={{
            ...styles.animationWrapper,
            transform: [{ translateX: passwordInputPos }],
          }}
        >
          <View style={styles.row}>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth,
              }}
            >
              <Input
                label="E-mail"
                value={email}
                ref={emailInputRef}
                placeholder="Enter your e-mail to login"
                style={{
                  width: "85%",
                  maxWidth: "90%",
                }}
                error={Boolean(error) ?? false}
                keyboardType="email-address"
                onChange={handleOnChangeEmail}
              />

              <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                {error ? (
                  <Text
                    style={{
                      color: "#D14343",
                      alignSelf: "flex-start",
                      fontWeight: "400",
                      letterSpacing: 0.4,
                      paddingLeft: windowWidth - windowWidth * 0.9,
                    }}
                  >
                    {error}
                  </Text>
                ) : null}
              </View>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth,
              }}
            >
              <Input
                label="Password"
                value={password}
                ref={passwordInputRef}
                placeholder="Enter password"
                style={{
                  width: "85%",
                  maxWidth: "90%",
                }}
                error={Boolean(error) ?? false}
                onChange={handleOnChangePassword}
                secureTextEntry={secretMap["password"]}
                right={
                  <TextInput.Icon
                    style={{ paddingTop: 8 }}
                    onPress={handlePassToggle("password")}
                    icon={secretMap["password"] ? "eye-off" : "eye"}
                  />
                }
              />

              <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                {error ? (
                  <Text
                    style={{
                      color: "#D14343",
                      alignSelf: "flex-start",
                      fontWeight: "400",
                      letterSpacing: 0.4,
                      paddingLeft: windowWidth - windowWidth * 0.9,
                    }}
                  >
                    {error}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </Animated.View>
        <AuthFooterActions
          handleOnPressPrimary={handleOnPressPrimary}
          handleOnPressSecondary={handleOnPressSecondary}
          secondaryText={step === 1 ? "Create Account" : "Change e-mail"}
          primaryText={step === 1 ? "Next" : "Submit"}
          step={step}
          isLoading={verifyResult.isFetching || loginApiResult.isLoading}
          disabled={verifyResult.isFetching || loginApiResult.isLoading}
        />
      </View>
    </KeyboarDismissView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  headerContainer: {
    alignItems: "center",
  },
  animationWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
  },
});

export default LoginScreen;
