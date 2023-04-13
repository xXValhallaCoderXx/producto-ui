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
import { JWT_KEY_STORE } from "../../../shared/constants";
import { useVerifyOtpMutation } from "../../../api/auth-api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { MainInput as Input } from "../../../components";
import { useFormik } from "formik";
import { Text, useTheme } from "react-native-paper";
import FooterActions from "./FooterAction";

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [verifyOtpApi, verifyOtpApiResult] = useVerifyOtpMutation();
  const userEmail = useSelector((state) => state.global.email);

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    // validateOnChange: false,
    validationSchema: Yup.object().shape({
      code: Yup.string()
        .required("OTP code is required")
        .min(6, "OTP code must be a minimum of 6 characters"),
    }),

    onSubmit: async ({ code }) => {
      verifyOtpApi({ email: userEmail, code });
    },
  });

  useEffect(() => {
    if (verifyOtpApiResult.isSuccess) {
      setTokenAndRedirect(verifyOtpApiResult.data);
    }
  }, [verifyOtpApiResult]);

  const setTokenAndRedirect = async (_data) => {
    const { accessToken } = _data;
    await SecureStore.setItemAsync(JWT_KEY_STORE, accessToken);
    navigation.navigate("EnterPassword");
  };

  const handleBackToLogin = () => {
    formik.resetForm();
    navigation.navigate("Login");
  };

  const handleOnPressPrimary = async () => {
    await formik.handleSubmit();
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
            An E-mail has been sent to{" "}
            <Text style={{ fontWeight: 600 }}>{userEmail}</Text>
          </Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "space-between", marginTop: 20 }}
        >
          <View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: "100%",
                  maxWidth: 450,
                  paddingLeft: 25,
                  paddingRight: 25,
                }}
              >
                <Text style={{ textAlign: "left", marginBottom: 10 }}>
                  Please enter your OTP code below
                </Text>
                <Input
                  value={formik.values.code}
                  placeholder="OTP Code..."
                  style={{ width: "100%" }}
                  onChangeText={formik.handleChange("code")}
                  onBlur={formik.handleBlur("code")}
                  keyboardType="email-address"
                />
                <View style={{ width: "100%", height: 25, marginTop: 10 }}>
                  {formik.errors.code ? (
                    <Text style={styles.formError}>{formik.errors.code}</Text>
                  ) : null}
                  {verifyOtpApiResult.isError ? (
                    <Text style={styles.formError}>
                      {verifyOtpApiResult?.error?.data?.message}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          <FooterActions
            handleOnPressPrimary={handleOnPressPrimary}
            handleOnPressSecondary={handleBackToLogin}
            disabledPrimary={false}
            isLoading={false}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
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
    formError: {
      color: theme.colors.error,
      fontSize: 12,
      fontWeight: "400",
      paddingLeft: 15,
    },
  });

export default RegisterScreen;
