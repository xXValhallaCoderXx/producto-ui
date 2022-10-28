import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";
import { useRegisterMutation } from "../../../api/auth-api";
import ProductoButton from "../../../components/Button";
import { useFormik } from "formik";
import { TextInput, Text, useTheme } from "react-native-paper";
import LayoutView from "../../../components/LayoutView";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Localization from "expo-localization";
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
    // validate: (values) => {
    //   const errors = {
    //     ...(Boolean(passwordCheck(values.password)) && {password: passwordCheck(values.password)}),
    //     ...(Boolean(passwordCheck(values.password)) && {confirmPassword: passwordCheck(values.confirmPassword)})
    //   };
    //   return errors;
    // },
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

  return (
    <LayoutView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={50}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 86,
            marginBottom: 40,
          }}
        >
          <Image
            style={{ height: 40, width: 220 }}
            source={require("../../../assets/images/title-dark.png")}
          />
        </View>

        <View style={{ alignItems: "center", flexGrow: 1 }}>
          <View style={{ width: "85%" }}>
            <TextInput
              onChangeText={formik.handleChange("email")}
              autoFocus
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
              mode="outlined"
              label="E-mail"
              keyboardType="email-address"
              placeholder="Enter Email"
              theme={{ roundness: 8 }}
              style={{
                backgroundColor: "white",
                height: 55,
                fontSize: 17,
              }}
            />
            <View style={{ height: 25 }}>
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: theme.colors.error,
                }}
              >
                {(formik.touched["email"] && formik?.errors?.email) || ""}
              </Text>
            </View>

            <TextInput
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              value={formik.values.password}
              mode="outlined"
              label="Password"
              placeholder="Enter Password"
              secureTextEntry={secretMap["password"]}
              theme={{ roundness: 8 }}
              style={{
                backgroundColor: "white",
                marginTop: 10,
                height: 55,
                fontSize: 17,
              }}
              right={
                <TextInput.Icon
                  style={{ paddingTop: 8 }}
                  onPress={handlePassToggle("password")}
                  icon={secretMap["password"] ? "eye-off" : "eye"}
                />
              }
            />
            <View style={{ height: 25 }}>
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: theme.colors.error,
                }}
              >
                {(formik.touched["password"] && formik?.errors?.password) || ""}
              </Text>
            </View>

            <TextInput
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              secureTextEntry={secretMap["confirmPassword"]}
              value={formik.values.confirmPassword}
              mode="outlined"
              label="Confirm Password"
              placeholder="Confirm Password"
              theme={{ roundness: 8 }}
              style={{
                backgroundColor: "white",
                marginTop: 10,
                height: 55,
                fontSize: 17,
              }}
              right={
                <TextInput.Icon
                  style={{ paddingTop: 8 }}
                  onPress={handlePassToggle("confirmPassword")}
                  icon={secretMap["confirmPassword"] ? "eye-off" : "eye"}
                />
              }
            />
            <View style={{ height: 20 }}>
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: theme.colors.error,
                }}
              >
                {(formik.touched["confirmPassword"] &&
                  formik?.errors?.confirmPassword) ||
                  ""}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={{ alignItems: "center", marginTop: 20 }}>
        <ProductoButton
          loading={registerApiResult.isLoading}
          type="contained"
          disabled={registerApiResult.isLoading || !formik.isValid}
          title="Register"
          onPress={formik.handleSubmit}
          color="primary"
        />
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: "black" }} h5>
            Already have an account?
          </Text>
          <Text
            h6
            style={{
              color: theme.colors.primary,
              marginTop: 5,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Log-in Here
          </Text>
        </TouchableOpacity>
      </View> */}

        <FooterActions
          handleOnPressPrimary={formik.handleSubmit}
          handleOnPressSecondary={() => navigation.navigate("Login")}
          disabledPrimary={
            registerApiResult.isLoading || !formik.isValid || !formik.dirty
          }
          isLoading={registerApiResult.isLoading}
        />
      </KeyboardAvoidingView>
    </LayoutView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
  },
  input: {
    width: 300,
    height: 45,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default RegisterScreen;
