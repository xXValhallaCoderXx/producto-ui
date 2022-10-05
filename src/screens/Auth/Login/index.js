import { useState, useRef, useEffect } from "react";
import { TextInput, Animated, ScrollView, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Text } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useWindowDimensions } from "react-native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import { useFormik } from "formik";
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

const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

const titleDark = require("../../../assets/images/title-dark.png");
const LoginScreen = ({ navigation }) => {
  const emailInputRef = useRef(null);
  const dispatch = useDispatch();
  const passwordInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordInputPos = useRef(new Animated.Value(windowWidth / 2)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult] = useLazyVerifyEmailQuery({
    email,
  });
  const [step, setStep] = useState(1);

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
    if (email.match(validEmailRegex) === null && email !== "") {
      setError("You must enter a valid email address");
    }
  }, [email]);

  useEffect(() => {
    if (loginApiResult.isError) {
      ToastAndroid.show("Incorrect Credentials", ToastAndroid.SHORT);
    }
  }, [loginApiResult.isError]);

  useEffect(() => {
    if (loginApiResult.isSuccess) {
      setTokenAndRedirect(loginApiResult.data);
    }
  }, [loginApiResult.isSuccess]);

  setTokenAndRedirect = async (token) => {
    const { accessToken, refreshToken } = token;
    await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);

    ToastAndroid.show("Login success", ToastAndroid.SHORT);
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
        if (res.data) {
          // setTokenAndRedirect(res.data);
        } else if (res.error.status === 400) {
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

  const handleOnChangeEmail = (value) => {
    setError("");
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setError("");
    setPassword(value);
  };

  return (
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            ...styles.inputWrapper,
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
              <TextInput
                style={{
                  ...styles.input,
                  width: windowWidth * 0.85,
                  maxWidth: windowWidth * 0.9,
                }}
                ref={emailInputRef}
                onChangeText={handleOnChangeEmail}
                value={email}
                nativeID="email"
                placeholder="Enter your email..."
              />

              {error ? (
                <Text
                  style={{
                    marginTop: 10,
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

            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  width: windowWidth * 0.85,
                  maxWidth: windowWidth * 0.9,
                }}
                ref={passwordInputRef}
                onChangeText={handleOnChangePassword}
                value={password}
                nativeID="password"
                placeholder="Enter your password..."
              />
              {error ? (
                <Text
                  style={{
                    marginTop: 10,
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
        </Animated.View>

        <FooterActions
          handleOnPressPrimary={handleOnPressPrimary}
          handleOnPressSecondary={handleOnPressSecondary}
          step={step}
          email={email}
          password={password}
          isLoading={verifyResult.isFetching || loginApiResult.isLoading}
        />
      </ScrollView>
    </LayoutView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 106,
  },
  secondaryTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginLeft: -10,
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
