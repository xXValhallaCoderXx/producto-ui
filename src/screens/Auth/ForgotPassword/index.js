import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import * as Yup from "yup";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainInput as Input } from "../../../components";
import { useFormik } from "formik";
import { Text, useTheme } from "react-native-paper";
import FooterActions from "./FooterAction";
import { useToast } from "react-native-toast-notifications";

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const toast = useToast();
  const [serverError, setServerError] = useState("");
  const userEmail = useSelector((state) => state.global.email);

  //   const formik = useFormik({
  //     initialValues: {
  //       email: "",
  //     },
  //     validateOnChange: false,
  //     validationSchema: Yup.object().shape({
  //       email: Yup.string()
  //         .required("Email field is required")
  //         .email("Please enter a valid e-mail address"),
  //     }),

  //     onSubmit: async ({ email }) => {
  //       setStep(2);
  //       //   if (result?.data?.data) {
  //       //   }
  //     },
  //   });

  const handleBackToLogin = () => {
    // formik.resetForm();
    navigation.navigate("Login");
  };

  const handleOnPressPrimary = () => {
    if (step === 1) {
      setStep(2);
      //   formik.handleSubmit();
    } else if (step === 2) {
      navigation.navigate("EnterPassword");
    }
  };

  const PAGE_TITLE = {
    1: "Enter your email to recieve a OTP code",
    2: "Please enter your OTP code",
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        // keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 20}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={styles.titleContainer}>
          <Image
            style={styles.titleImage}
            source={require("../../../assets/images/title-dark.png")}
          />
          <Text style={styles.secondaryTitle}>{PAGE_TITLE[step]}</Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "space-between", marginTop: 20 }}
        >
          {step === 1 ? (
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
                    You are requesting for an OTP to be sent to
                  </Text>
                  <Input
                    // label="Email"
                    value={userEmail}
                    style={{ width: "100%" }}
                    // onChangeText={emailForm.handleChange("email")}
                    // onBlur={emailForm.handleBlur("email")}
                    keyboardType="email-address"
                  />
                </View>
              </View>
            </View>
          ) : step === 2 ? (
            <View
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                width: "100%",
                maxWidth: 450,
              }}
            >
              <Input
                label="OTP"
                placeholder="Enter Your OTP Code..."
                // ref={emailInputRef}
                // value={emailForm.values.email}
                style={{ width: "100%" }}
                // onChangeText={emailForm.handleChange("email")}
                // onBlur={emailForm.handleBlur("email")}
                // keyboardType="email-address"
              />
            </View>
          ) : (
            <View
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                width: "100%",
                maxWidth: 450,
              }}
            >
              <Input
                label="Password"
                placeholder="Enter your new password..."
                // ref={emailInputRef}
                // value={emailForm.values.email}
                style={{ width: "100%" }}
                // onChangeText={emailForm.handleChange("email")}
                // onBlur={emailForm.handleBlur("email")}
                // keyboardType="email-address"
              />
            </View>
          )}
          <FooterActions
            handleOnPressPrimary={handleOnPressPrimary}
            handleOnPressSecondary={handleBackToLogin}
            disabledPrimary={false}
            isLoading={false}
            step={step}
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

export default RegisterScreen;
