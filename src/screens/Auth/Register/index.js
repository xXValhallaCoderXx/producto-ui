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

import { useRegisterMutation } from "../../../api/auth-api";
import { useFormik } from "formik";
import { Text, useTheme } from "react-native-paper";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
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
      toast.show("Email succesffully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Error Registering User!",
        description: "Please try something else",
      });
    }
  }, [registerApiResult.isError]);

  useEffect(() => {
    if (registerApiResult.isSuccess) {
      toast.show("Email succesffully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Registration Success!",
        description: "Welcome to Productö",
      });
    }
  }, [registerApiResult.isSuccess]);

  const handleBackToLogin = () => {
    formik.resetForm();
    navigation.navigate("Login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={20}
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
        <View style={{ height: 20 }}></View>

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <View style={{ alignItems: "center" }}>
              <View style={{ width: "85%" }}>
                <Input
                  autoFocus
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
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
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
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
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
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
    marginTop: 60,
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
});

export default RegisterScreen;
