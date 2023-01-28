import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MainInput as Input } from "../../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRegisterMutation } from "../../../api/auth-api";
import { useFormik } from "formik";
import { Text, useTheme } from "react-native-paper";
import {
  toggleIsAuthenticated,
  toggleFirstLoad,
} from "../../../shared/slice/global-slice";
import FooterActions from "./FooterAction";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import { useToast } from "react-native-toast-notifications";

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const [registerApi, registerApiResult] = useRegisterMutation();
  const [secretMap, setSecretMap] = useState({
    password: true,
    confirmPassword: true,
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email field is required")
        .email("Please enter a valid e-mail address"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Password confirmation is required")
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters"),
    }),

    onSubmit: async ({ email, password }) => {
      const timezone = Localization.timezone;
      const result = await registerApi({ email, password, timezone });
      if (result?.data?.data) {
        const { accessToken, refreshToken } = result?.data?.data;
        const isFirstLoad = await AsyncStorage.getItem(`@first-load-${email}`);
        if (!isFirstLoad) {
          dispatch(toggleFirstLoad(true));
        }

        await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
        await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);
        dispatch(toggleIsAuthenticated(true));
      }
    },
  });

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  useEffect(() => {
    if (registerApiResult.isError) {
      setServerError(
        registerApiResult?.error?.data?.message ?? "Sorry an error occured"
      );
    }
  }, [registerApiResult.isError]);

  useEffect(() => {
    if (registerApiResult.isSuccess) {
      toast.show("Email succesffully updated", {
        type: "success",
        title: "Registration Success!",
        description: "Welcome to Productö",
      });
    }
  }, [registerApiResult.isSuccess]);

  const handleBackToLogin = () => {
    formik.resetForm();
    navigation.navigate("Login");
  };

  const handleOnChangeText = (field) => (e) => {
    if (serverError) {
      setServerError("");
    }
    formik.setFieldValue(field, e);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 20}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={styles.titleContainer}>
          <Image
            style={styles.titleImage}
            source={require("../../../assets/images/title-dark.png")}
          />
          <Text style={styles.secondaryTitle}>
            Create an account, and unlock your productivity
          </Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "space-between", marginTop: 20 }}
        >
          <View>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: "85%" }}>
                <Input
                  autoFocus
                  onChangeText={handleOnChangeText("email")}
                  // onBlur={formik.handleBlur("email")}
                  value={formik.values.email}
                  label="E-mail"
                  keyboardType="email-address"
                  placeholder="Enter Email"
                />

                <View style={{ height: 20, marginBottom: 10 }}>
                  <Text
                    style={{ ...styles.errorText, color: theme.colors.error }}
                  >
                    {(formik.touched["email"] && formik?.errors?.email) || ""}
                  </Text>
                </View>

                <Input
                  onChangeText={handleOnChangeText("password")}
                  // onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                  label="Password"
                  placeholder="Enter Password"
                  secureTextEntry={secretMap["password"]}
                  rightIcon={secretMap["password"] ? "eye-off" : "eye"}
                  onPressIcon={handlePassToggle("password")}
                />

                <View style={{ height: 20, marginBottom: 10 }}>
                  <Text
                    style={{ ...styles.errorText, color: theme.colors.error }}
                  >
                    {(formik.touched["password"] && formik?.errors?.password) ||
                      ""}
                  </Text>
                </View>

                <Input
                  onChangeText={handleOnChangeText("confirmPassword")}
                  // onBlur={formik.handleBlur("confirmPassword")}
                  secureTextEntry={secretMap["confirmPassword"]}
                  value={formik.values.confirmPassword}
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  rightIcon={secretMap["confirmPassword"] ? "eye-off" : "eye"}
                  onPressIcon={handlePassToggle("confirmPassword")}
                />

                <View style={{ height: 20 }}>
                  <Text
                    style={{ ...styles.errorText, color: theme.colors.error }}
                  >
                    {(formik.touched["confirmPassword"] &&
                      formik?.errors?.confirmPassword) ||
                      ""}
                  </Text>
                </View>
                <View style={{ height: 24 }}>
                  {serverError ? (
                    <Text
                      style={{
                        ...styles.errorText,
                        color: theme.colors.error,
                        textAlign: "center",
                      }}
                    >
                      {serverError}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          <FooterActions
            handleOnPressPrimary={formik.handleSubmit}
            handleOnPressSecondary={handleBackToLogin}
            disabledPrimary={registerApiResult.isLoading}
            isLoading={registerApiResult.isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  titleImage: {
    height: 40,
    width: 220,
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    marginTop: 10,
  },
  errorText: {
    marginTop: 5,
    marginLeft: 10,
    fontWeight: "400",
  },
  secondaryTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginLeft: -10,
    fontWeight: "500",
  },
});

export default RegisterScreen;
