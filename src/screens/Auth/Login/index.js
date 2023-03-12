import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { useState, useRef, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import {
  KeyboardAvoidingView,
  useWindowDimensions,
  Button,
} from "react-native";
import {
  toggleIsAuthenticated,
  toggleFirstLoad,
  setEmail,
} from "../../../shared/slice/global-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text } from "react-native-paper";
import FooterActions from "./FooterAction";
import { MainInput as Input } from "../../../components";
const titleDark = require("../../../assets/images/title-dark.png");

import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import {
  StyleSheet,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  useLoginMutation,
  useLazyVerifyEmailQuery,
} from "../../../api/auth-api";
import { TouchableOpacity } from "react-native-gesture-handler";

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const toast = useToast();
  const dispatch = useDispatch();
  const passwordInputRef = useRef(null);

  const emailInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const passwordInputPos = useRef(new Animated.Value(windowWidth / 2)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult] = useLazyVerifyEmailQuery();

  const [step, setStep] = useState(1);
  const [secretMap, setSecretMap] = useState({
    password: true,
  });

  const emailForm = useFormik({
    initialValues: {
      email: "",
    },
    // validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Please enter an e-mail address")
        .email("Please enter a valid e-mail address"),
    }),
    onSubmit: async ({ email }) => {
      verifyTigger({ email });
    },
  });

  const passwordForm = useFormik({
    initialValues: {
      password: "",
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("Password is required")
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters"),
    }),

    onSubmit: async ({ password }) => {
      loginApi({ email: emailForm.values.email, password });
    },
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
      emailForm.setFieldError(
        "email",
        verifyResult?.error?.data?.message ?? "Sorry an error occured"
      );
    }
  }, [verifyResult.isError]);

  useEffect(() => {
    if (verifyResult.isSuccess) {
      dispatch(setEmail(emailForm.values.email));
      setStep(2);
    }
  }, [verifyResult.isSuccess, verifyResult.isFetching]);

  useEffect(() => {
    if (loginApiResult.isSuccess) {
      toast.show("Login Success!", {
        type: "success",
        title: "Login Success!",
      });
      setTokenAndRedirect(loginApiResult.data);
    }
  }, [loginApiResult.isSuccess]);

  useEffect(() => {
    if (loginApiResult.isError) {
      passwordForm.setFieldError(
        "password",
        loginApiResult?.error?.data?.message ?? "Sorry an error occured"
      );
    }
  }, [loginApiResult.isError]);

  const setTokenAndRedirect = async (_data) => {
    const { accessToken, refreshToken, email } = _data;

    const isFirstLoad = await AsyncStorage.getItem(`@first-load-${email}`);
    if (!isFirstLoad || isFirstLoad !== "false") {
      dispatch(toggleFirstLoad(true));
    }
    await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);
    dispatch(toggleIsAuthenticated(true));
  };

  const handleOnPressPrimary = async () => {
    if (step === 1) {
      await emailForm.handleSubmit();
      passwordInputRef.current.focus();
    } else if (step === 2) {
      passwordForm.handleSubmit();
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
    if (step === 1) {
      emailForm.resetForm();
      passwordForm.resetForm();
      navigation.navigate("Registration");
    } else {
      passwordForm.setErrors({});
      emailInputRef.current.focus();
      setStep(nextStep);
    }
  };

  const handleForgotPassword = () => {
    console.log("CLICK");
    navigation.navigate("ForgotPassword");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 20}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={styles.titleContainer}>
              <Image
                source={titleDark}
                resizeMode="contain"
                style={{
                  width: 231,
                  height: 42,
                }}
              />
              <Text style={{ ...styles.secondaryTitle, marginTop: 19 }}>
                Sign in, to unlock your productivity
              </Text>
            </View>
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
                    alignItems: "center",
                    width: windowWidth,
                  }}
                >
                  <View
                    style={{
                      paddingLeft: 25,
                      paddingRight: 25,
                      width: "100%",
                      maxWidth: 450,
                    }}
                  >
                    <Input
                      label="Email"
                      ref={emailInputRef}
                      value={emailForm.values.email}
                      style={{ width: "100%" }}
                      onChangeText={emailForm.handleChange("email")}
                      onBlur={emailForm.handleBlur("email")}
                      keyboardType="email-address"
                    />

                    <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                      {emailForm.touched.email && emailForm.errors.email ? (
                        <Text
                          style={{
                            color: theme.colors.error,
                            fontSize: 12,
                            fontWeight: "400",
                            paddingLeft: 15,
                          }}
                        >
                          {emailForm.errors.email}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    width: "100%",
                    paddingLeft: 25,
                    paddingRight: 25,
                    maxWidth: 450,
                  }}
                >
                  <Input
                    label="Password"
                    value={passwordForm.values.password}
                    ref={passwordInputRef}
                    style={{ width: "100%" }}
                    onChangeText={passwordForm.handleChange("password")}
                    onBlur={passwordForm.handleBlur("password")}
                    secureTextEntry={secretMap["password"]}
                    rightIcon={secretMap["password"] ? "eye-off" : "eye"}
                    onPressIcon={handlePassToggle("password")}
                  />

                  <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                    {passwordForm.touched.password &&
                    passwordForm.errors.password ? (
                      <Text
                        style={{
                          color: theme.colors.error,
                          fontSize: 12,
                          fontWeight: "400",
                          paddingLeft: 15,
                        }}
                      >
                        {passwordForm.errors.password}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      style={{ padding: 15 }}
                    >
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: "600",
                        }}
                      >
                        Forgot your password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>

          <FooterActions
            handleOnPressPrimary={handleOnPressPrimary}
            handleOnPressSecondary={handleOnPressSecondary}
            step={step}
            isLoading={
              verifyResult.isFetching ||
              loginApiResult.isLoading ||
              loginApiResult.status === "fulfilled"
            }
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  secondaryTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginLeft: -10,
    fontWeight: "500",
  },
  inputWrapper: {
    alignItems: "center",
    marginTop: 50,
  },
});

export default LoginScreen;
