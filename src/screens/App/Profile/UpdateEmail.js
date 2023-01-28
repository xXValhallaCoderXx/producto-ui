import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";
import { useToast } from "react-native-toast-notifications";
import ProductoButton from "../../../components/Button";
import { TextInput, Text, useTheme } from "react-native-paper";
import { useFormik } from "formik";
import { View } from "react-native";
import { useUpdateEmailMutation } from "../../../api/auth-api";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { MainInput as Input } from "../../../components";
const UpdateEmail = ({ route, navigation }) => {
  const theme = useTheme();
  const toast = useToast();
  const payload = useRef({});
  const [isOpen, setIsOpen] = useState(false);
  const [secretMap, setSecretMap] = useState({
    password: true,
  });
  const [updateEmail, updateEmailResult] = useUpdateEmailMutation();

  useEffect(() => {
    navigation.setOptions({ title: "Update Email" });
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Please enter your current password"),
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Your new e-mail address is required"),
    }),

    onSubmit: async ({ email, password }) => {
      payload.current = {
        email,
        password,
      };
      setIsOpen(true);
    },
  });

  const onConfirmEmailChange = async () => {
    const { email, password } = payload.current;
    const result = await updateEmail({ email, password });

    if (!result.error) {
      const { tokens } = result?.data;
      await SecureStore.setItemAsync(JWT_KEY_STORE, tokens.accessToken);
      await SecureStore.setItemAsync(
        REFRESH_JWT_KEY_STORE,
        tokens.refreshToken
      );
    }
  };

  const onCancelEmailChange = () => {
    setIsOpen(false);
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  useEffect(() => {
    if (updateEmailResult.isSuccess) {
      payload.current = {};
      navigation.navigate("Accounts");

      toast.show("Email succesfully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Succesfully updated email!",
        description: "You may now login with your new email",
      });
    }
    if (updateEmailResult.isError) {
      payload.current = {};
      const message = Array.isArray(updateEmailResult?.error?.data?.message)
        ? updateEmailResult?.error?.data?.message[0]
        : updateEmailResult?.error?.data?.message;

      toast.show("Email update error", {
        type: "error",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Error updating email!",
        description: message ?? "Sorry, an error occured",
      });
    }
  }, [updateEmailResult]);

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Enter your current password, and your new email you would like to change
        to.
      </Text>

      <Input
        autoFocus
        label="Password"
        onChangeText={formik.handleChange("password")}
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        placeholder="Enter current password"
        secureTextEntry={secretMap["password"]}
        rightIcon={secretMap["password"] ? "eye-off" : "eye"}
        onPressIcon={handlePassToggle("password")}
      />

      <View style={{ height: 20, marginBottom: 10 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {(formik.touched["password"] && formik?.errors?.password) || ""}
        </Text>
      </View>

      <Input
        label="New Email"
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        placeholder="Enter a new email"
        keyboardType="email-address"
      />

      <View style={{ height: 20 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {(formik.touched["email"] && formik?.errors?.email) || ""}
        </Text>
      </View>

      <ProductoButton
        title="Change Email"
        type="contained"
        style={{ marginTop: 30 }}
        onPress={formik.handleSubmit}
        disabled={updateEmailResult.isLoading}
        loading={updateEmailResult.isLoading}
      />
      <ConfirmationModal
        isVisible={isOpen}
        title="Change email"
        description="This will be your new email to login with"
        onConfirm={onConfirmEmailChange}
        onCancel={onCancelEmailChange}
        isLoading={updateEmailResult.isLoading}
      />
    </View>
  );
};

export default UpdateEmail;
