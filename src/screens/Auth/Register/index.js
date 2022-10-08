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
import { StyleSheet, Platform, View, ToastAndroid, Image } from "react-native";
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
      email: Yup.string().required("Email field is required").email(),
      password: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Password field is required"),
      confirmPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Confirm Password field is required"),
    }),

    onSubmit: async ({ email, password }) => {
      const result = await registerApi({ email, password });
      if (result?.data?.data) {
        const { accessToken, refreshToken } = result.data.data;
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

  console.log("FORMIK: ", formik);
  return (
    <LayoutView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Image
          style={{ height: 40, width: 220, marginBottom: 40 }}
          source={require("../../../assets/images/title-dark.png")}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <View style={{ width: "85%" }}>
          <TextInput
            onChangeText={formik.handleChange("email")}
            autoFocus
            dense
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            mode="outlined"
            label="Email"
            keyboardType="email-address"
            placeholder="Enter Email"
            style={{
              backgroundColor: "white",
            }}
          />
          <View style={{ height: 20 }}>
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
            dense
            onBlur={formik.handleBlur("password")}
            value={formik.values.password}
            mode="outlined"
            label="Password"
            placeholder="Enter Password"
            style={{
              backgroundColor: "white",
              marginTop: 10,
            }}
            // secureTextEntry={secretMap["password"]}
            right={
              <TextInput.Icon
                style={{ paddingBottom: 4 }}
                onPress={handlePassToggle("password")}
                icon="eye"
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
              {(formik.touched["password"] && formik?.errors?.password) || ""}
            </Text>
          </View>

          <TextInput
            onChangeText={formik.handleChange("confirmPassword")}
            dense
            onBlur={formik.handleBlur("confirmPassword")}
            value={formik.values.confirmPassword}
            mode="outlined"
            label="Confirm Password"
            placeholder="Confirm Password"
            style={{
              backgroundColor: "white",
              marginTop: 10,
            }}
            // secureTextEntry={secretMap["confirmPassword"]}
            right={
              <TextInput.Icon
                style={{ paddingBottom: 4 }}
                onPress={handlePassToggle("confirmPassword")}
                icon="eye"
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

      <View style={{ alignItems: "center", marginTop: 20 }}>
        <ProductoButton
          loading={registerApiResult.isLoading}
          type="contained"
          // disabled={!email || !password || (!confirmPassword && !error)}
          title="Register"
          onPress={formik.handleSubmit}
          color="primary"
        />
        <Text style={{ color: theme.colors.primary, marginTop: 20 }} h5>
          Already have an account?
        </Text>
        <Text
          h6
          onPress={() => navigation.navigate("Login")}
          style={{
            color: "black",
            marginTop: 5,
            fontWeight: "700",
          }}
        >
          Log-in Here
        </Text>
      </View>
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
