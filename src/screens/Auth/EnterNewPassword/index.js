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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainInput as Input } from "../../../components";
import { useFormik } from "formik";
import { Text, useTheme } from "react-native-paper";
import FooterActions from "./FooterAction";
import { useToast } from "react-native-toast-notifications";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import {
  toggleIsAuthenticated,
  toggleFirstLoad,
} from "../../../shared/slice/global-slice";

import { useForgotPasswordUpdateMutation } from "../../../api/auth-api";

const EnterNewPasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const userEmail = useSelector((state) => state.global.email);
  const [secretMap, setSecretMap] = useState({
    password: true,
    confirmPassword: true,
  });
  const [forgotPasswordApi, forgotPasswordApiResult] =
    useForgotPasswordUpdateMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
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

    onSubmit: async ({ password }) => {
      forgotPasswordApi({ newPassword: password });
    },
  });

  useEffect(() => {
    if (forgotPasswordApiResult.isSuccess) {
      handlePasswordResetSuccess();
    }
  }, [forgotPasswordApiResult]);

  const handlePasswordResetSuccess = async () => {
    const { accessToken, refreshToken } = forgotPasswordApiResult?.data?.data;
    const isFirstLoad = await AsyncStorage.getItem(`@first-load-${userEmail}`);
    if (!isFirstLoad || isFirstLoad !== "false") {
      dispatch(toggleFirstLoad(true));
    }

    await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, refreshToken);
    dispatch(toggleIsAuthenticated(true));
  };

  const handleOnChangeText = (field) => (e) => {
    if (serverError) {
      setServerError("");
    }
    formik.setFieldValue(field, e);
  };

  const handleBackToLogin = () => {
    formik.resetForm();
    navigation.navigate("Login");
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={styles.titleContainer}>
          <Image
            style={styles.titleImage}
            source={require("../../../assets/images/title-dark.png")}
          />
          <Text style={styles.secondaryTitle}>
            Please enter your new password
          </Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "space-between", marginTop: 20 }}
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Input
              onChangeText={handleOnChangeText("password")}
              value={formik.values.password}
              label="Password"
              placeholder="Enter Password"
              secureTextEntry={secretMap["password"]}
              rightIcon={secretMap["password"] ? "eye-off" : "eye"}
              onPressIcon={handlePassToggle("password")}
            />

            <View style={{ height: 20, marginBottom: 10 }}>
              <Text style={styles.errorText}>
                {(formik.touched["password"] && formik?.errors?.password) || ""}
              </Text>
            </View>
            <Input
              onChangeText={handleOnChangeText("confirmPassword")}
              secureTextEntry={secretMap["confirmPassword"]}
              value={formik.values.confirmPassword}
              label="Confirm Password"
              placeholder="Confirm Password"
              rightIcon={secretMap["confirmPassword"] ? "eye-off" : "eye"}
              onPressIcon={handlePassToggle("confirmPassword")}
            />

            <View style={{ height: 20 }}>
              <Text style={styles.errorText}>
                {(formik.touched["confirmPassword"] &&
                  formik?.errors?.confirmPassword) ||
                  ""}
              </Text>
            </View>
          </View>
          <FooterActions
            handleOnPressPrimary={formik.handleSubmit}
            handleOnPressSecondary={handleBackToLogin}
            disabledPrimary={false}
            isLoading={false}
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
    marginLeft: 15,
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

export default EnterNewPasswordScreen;
