import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
// import { SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
// } from "react-native-reanimated";
import { useRegisterMutation } from "../../../api/auth-api";
import { useFormik } from "formik";
import { TextInput, Text, useTheme } from "react-native-paper";
// import KeyboardDismissView from "../../../components/Layouts/KeyboardDismissView";
// import { useKeyboard } from "../../../shared/hooks/use-keyboard";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import AuthFooterActions from "../../../components/AuthFooterActions";
import Input from "../../../components/Input";
// import AuthFooterActions from "../../../components/AuthFooterActions";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Localization from "expo-localization";
// import FooterActions from "./FooterAction";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import { useToast } from "react-native-toast-notifications";
// import ProductoInput from "../../../components/Input";
const TITLE_DARK = require("../../../../assets/title-dark.png");

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const toast = useToast();
  const [registerApi, registerApiResult] = useRegisterMutation();
  // const randomNumber = useSharedValue(60);
  // const animXPos = useSharedValue(20);
  // const { keyboardShown, keyboardHeight } = useKeyboard();

  const [secretMap, setSecretMap] = useState({
    password: true,
    confirmPassword: true,
  });

  // const style = useAnimatedStyle(() => {
  //   return { width: randomNumber.value * 4, height: randomNumber.value };
  // });
  // const animatedYPos = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: animXPos.value }],
  //   };
  // });
  // console.log("SHOWN: ", keyboardShown)
  // useEffect(() => {
  //   if (keyboardShown) {
  //     randomNumber.value = withSpring(50, { mass: 0.5 });
  //     animXPos.value = withSpring(-60, { mass: 0.5 });
  //   } else {
  //     randomNumber.value = withSpring(-10, { mass: 0.5 });
  //     animXPos.value = withSpring(20, { mass: 0.5 });
  //   }
  // }, [keyboardShown]);

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
        .required("E-mail field is required")
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
      const message =
        registerApiResult.error.data.message ?? "Sorry an error has occured";
      toast.show("Email succesffully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Error Registering User!",
        description: message,
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
    <View
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Image
          source={TITLE_DARK}
          resizeMode="contain"
          style={{ height: 80, width: 210 }}
        />
        <Text variant="bodyMedium">
          Create an account, to continue to Productö
        </Text>
      </View>
      <ScrollView contentContainerStyle={{alignItems: "center"}} style={{  marginTop: 30, flexGrow: 1 }}>
        <Input
          label="E-mail "
          value={""}
          placeholder="Enter an e-mail to register"
          style={{
            width: "85%",
            maxWidth: "90%",
          }}
          error={
            Boolean(formik.touched["email"] && formik?.errors?.email) ?? false
          }
          keyboardType="email-address"
          // onChange={handleOnChangeEmail}
        />
        <View style={{ height: 25, width: "85%", marginBottom: 10 }}>
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
        <Input
          label="Password"
          value={""}
          placeholder="Enter password"
          style={{
            width: "85%",
            maxWidth: "90%",
          }}
          error={
            Boolean(formik.touched["password"] && formik?.errors?.password) ?? false
          }

          // onChange={handleOnChangeEmail}
        />
        <View style={{ height: 25, width: "85%", marginBottom: 10}}>
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
        <Input
          label="Confirm password"
          value={""}
          placeholder="Confirm your new password"
          style={{
            width: "85%",
            maxWidth: "90%",
          }}
          error={
            Boolean(formik.touched["confirmPassword"] && formik?.errors?.confirmPassword) ?? false
          }

          // onChange={handleOnChangeEmail}
        />
        <View style={{ height: 25, width: "85%", marginBottom: 15 }}>
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
      </ScrollView>
      <AuthFooterActions
        handleOnPressPrimary={formik.handleSubmit}
        handleOnPressSecondary={() => navigation.navigate("login")}
        secondaryText={"Back to login"}
        primaryText={"Sign up"}
        loading={registerApiResult.isLoading}
        disabled={registerApiResult.isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0
  },
  headerContainer: {
    alignItems: "center",
  },
  animationWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 30,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
  },
  secondaryTitle: {
    fontSize: 14,
    // color: "gray",
    textAlign: "center",
    // fontFamily: "Inter",
    fontWeight: "500",
  },
});

export default RegisterScreen;

{
  /* 

      <View style={{ alignItems: "center", flexGrow: 1 }}>
        <View style={{ width: "85%" }}>
          <ProductoInput
            label="E-mail"
            value={formik.values.email}
            placeholder="Enter Email"
            onChange={formik.handleChange("email")}
            keyboardType="email-address"
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

          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <ProductoInput
              label="Password"
              value={formik.values.password}
              placeholder="Enter Password"
              onChange={formik.handleChange("password")}
              keyboardType="email-address"
              secureTextEntry={secretMap["password"]}
              right={
                <TextInput.Icon
                  style={{ paddingTop: 15 }}
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
          </View>

          <ProductoInput
            label="Confirm Password"
            value={formik.values.confirmPassword}
            placeholder="Confirm Password"
            onChange={formik.handleChange("confirmPassword")}
            keyboardType="email-address"
            secureTextEntry={secretMap["confirmPassword"]}
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
      <FooterActions
        handleOnPressPrimary={formik.handleSubmit}
        handleOnPressSecondary={() => navigation.navigate("Login")}
        disabledPrimary={registerApiResult.isLoading}
        isLoading={registerApiResult.isLoading}
      /> */
}
