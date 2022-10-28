import { useState, useRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import * as SecureStore from "expo-secure-store";
import { Text } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useWindowDimensions } from "react-native";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput as MuiTextInput } from "react-native-paper";
import LayoutView from "../../../components/LayoutView";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import {
  useLoginMutation,
  useLazyVerifyEmailQuery,
} from "../../../api/auth-api";
import FooterActions from "./FooterAction";
import { useToast } from "react-native-toast-notifications";
const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

const titleDark = require("../../../assets/images/title-dark.png");
const LoginScreen = ({ navigation }) => {
  const emailInputRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const passwordInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordInputPos = useRef(new Animated.Value(windowWidth / 2)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult] = useLazyVerifyEmailQuery({
    email,
  });

  const [step, setStep] = useState(1);
  const [secretMap, setSecretMap] = useState({
    password: true,
  });

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

  useEffect(() => {
    if (verifyResult.isError) {
      setError(verifyResult?.error?.data?.message);
    }
  }, [verifyResult]);

  useEffect(() => {
    if (loginApiResult.isError) {
      toast.show("Email succesffully updated", {
        type: "error",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Incorrect Credentials!",
      });
    }
  }, [loginApiResult.isError]);

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
    dispatch(toggleIsAuthenticated(true));
  };

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
      const res = await verifyTigger({ email });
      passwordInputRef.current.focus();
      if (res.isSuccess) {
        setStep(nextStep);
      } else {
        if (res.error.status === 200) {
          setStep(nextStep);
        } else if (res.error.status === 400) {
          setError(res.error.data.message[0]);
        } else if (res.error.status === 404) {
          setError("Email address not found");
        }
      }
    }
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
      navigation.navigate("Registration");
    } else {
      emailInputRef.current.focus();
      setStep(nextStep);
    }
  };
  const delayedQuery = useCallback(
    debounce((value) => checkEmail(value), 1000),
    []
  );
  const handleOnChangeEmail = (value) => {
    setError("");
    delayedQuery(value);
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setError("");
    setPassword(value);
  };

  const checkEmail = (_value) => {
    if (_value.match(validEmailRegex) === null && _value !== "") {
      setError("You must enter a valid email address");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LayoutView>
        <View style={styles.titleContainer}>
          <Image
            source={titleDark}
            resizeMode="contain"
            style={{
              width: 231,
              height: 42,
            }}
          ></Image>
          <View style={{ marginTop: 19 }}>
            <Text style={styles.secondaryTitle}>
              Sign in, to unlock your productivity
            </Text>
          </View>
        </View>
        <View>
          <Animated.View
            style={{
              ...styles.inputWrapper,
              marginBottom: 30,
              transform: [{ translateX: passwordInputPos }],
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: windowWidth,
                }}
              >
                <MuiTextInput
                  label="Email"
                  value={email}
                  mode="outlined"
                  error={false}
                  outlineColor="#bcc5d6"
                  ref={emailInputRef}
                  theme={{ roundness: 10 }}
                  style={{
                    backgroundColor: "white",
                    height: 55,
                    fontSize: 17,
                    width: "85%",

                    width: windowWidth * 0.85,
                    maxWidth: windowWidth * 0.9,
                  }}
                  onChangeText={handleOnChangeEmail}
                  keyboardType="email-address"
                />

                <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                  {error ? (
                    <Text
                      style={{
                        color: "#D14343",
                        alignSelf: "flex-start",
                        fontWeight: "700",
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
                <MuiTextInput
                  label="Password"
                  value={password}
                  mode="outlined"
                  error={false}
                  outlineColor="#bcc5d6"
                  ref={passwordInputRef}
                  style={{
                    backgroundColor: "white",
                    width: "85%",
                    height: 55,
                    fontSize: 17,
                    width: windowWidth * 0.85,
                    maxWidth: windowWidth * 0.9,
                  }}
                  onChangeText={handleOnChangePassword}
                  secureTextEntry={secretMap["password"]}
                  right={
                    <MuiTextInput.Icon
                      onPress={handlePassToggle("password")}
                      icon={secretMap["confirmPassword"] ? "eye-off" : "eye"}
                      color="#fff"
                    />
                  }
                />

                <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                  {error ? (
                    <Text
                      style={{
                        color: "#D14343",
                        alignSelf: "flex-start",
                        fontWeight: "700",
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

          <FooterActions
            handleOnPressPrimary={handleOnPressPrimary}
            handleOnPressSecondary={handleOnPressSecondary}
            step={step}
            email={email}
            password={password}
            isLoading={verifyResult.isFetching || loginApiResult.isLoading}
          />
        </View>
      </LayoutView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginTop: 106,
  },
  secondaryTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginLeft: -10,
    fontWeight: "500",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 80,
  },
  input: {
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default LoginScreen;
