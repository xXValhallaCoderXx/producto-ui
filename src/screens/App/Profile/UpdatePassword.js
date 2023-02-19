import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { useTheme } from "react-native-paper";
import { View } from "react-native";
import { useUpdatePasswordMutation } from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";
import { MainInput as Input } from "../../../components";
import ConfirmationModal from "../../../components/ConfirmationModal";

const EditPassword = ({ navigation }) => {
  const theme = useTheme();
  const toast = useToast();
  const payload = useRef({});
  const [isOpen, setIsOpen] = useState(false);
  const [secretMap, setSecretMap] = useState({
    newPassword: true,
    currentPassword: true,
    confirmPassword: true,
  });
  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  useEffect(() => {
    navigation.setOptions({ title: "Update Password" });
  }, []);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      currentPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Password field is required"),
      newPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Password field is required"),
      confirmPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Password field is required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),

    onSubmit: async ({ currentPassword, newPassword }) => {
      payload.current = {
        newPassword,
        currentPassword,
      };
      setIsOpen(true);
    },
  });

  useEffect(() => {
    if (updatePasswordResult.isSuccess) {
      formik.resetForm();
      toast.show("Password succesffully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Sucessfully updated password!",
        description: "You may now login with your new password",
      });
      setIsOpen(false);
      navigation.navigate("Accounts");
    }
    if (updatePasswordResult.isError) {
      const message = Array.isArray(updatePasswordResult?.error?.data?.message)
        ? updatePasswordResult?.error?.data?.message[0]
        : updatePasswordResult?.error?.data?.message;
      toast.show("Password update unsuccesful123456", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Error updating password!",
        description: message ?? "Sorry an error occured",
      });
    }
  }, [updatePasswordResult]);

  const onConfirmPasswordChange = async () => {
    const { newPassword, currentPassword } = payload.current;
    await updatePassword({ newPassword, currentPassword });
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

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Enter your current password, and your new password you wish to change
        to.
      </Text>

      <Input
        autoFocus
        label="Password"
        onChangeText={formik.handleChange("currentPassword")}
        onBlur={formik.handleBlur("currentPassword")}
        value={formik.values.currentPassword}
        placeholder="Enter current password"
        secureTextEntry={secretMap["currentPassword"]}
        rightIcon={secretMap["currentPassword"] ? "eye-off" : "eye"}
        onPressIcon={handlePassToggle("currentPassword")}
      />

      <View style={{ height: 20, marginBottom: 10 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {(formik.touched["currentPassword"] &&
            formik?.errors?.currentPassword) ||
            ""}
        </Text>
      </View>

      <Input
        label="New Password"
        onChangeText={formik.handleChange("newPassword")}
        onBlur={formik.handleBlur("newPassword")}
        value={formik.values.newPassword}
        placeholder="Enter new password"
        secureTextEntry={secretMap["newPassword"]}
        rightIcon={secretMap["newPassword"] ? "eye-off" : "eye"}
        onPressIcon={handlePassToggle("newPassword")}
      />

      <View style={{ height: 20, marginBottom: 10 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {(formik.touched["newPassword"] && formik?.errors?.newPassword) || ""}
        </Text>
      </View>

      <Input
        label="Confirm Password"
        onChangeText={formik.handleChange("confirmPassword")}
        onBlur={formik.handleBlur("confirmPassword")}
        value={formik.values.confirmPassword}
        placeholder="Confirm new password"
        secureTextEntry={secretMap["confirmPassword"]}
        rightIcon={secretMap["confirmPassword"] ? "eye-off" : "eye"}
        onPressIcon={handlePassToggle("confirmPassword")}
      />

      <View style={{ height: 20 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {(formik.touched["confirmPassword"] &&
            formik?.errors?.confirmPassword) ||
            ""}
        </Text>
      </View>

      <ProductoButton
        title="Change Password"
        type="contained"
        style={{ marginTop: 30 }}
        onPress={handleOnSubmit}
        disabled={updatePasswordResult.isLoading}
        loading={updatePasswordResult.isLoading}
      />
      <ConfirmationModal
        isVisible={isOpen}
        title="Change password"
        description="This will update your password"
        onConfirm={onConfirmPasswordChange}
        onCancel={onCancelEmailChange}
        isLoading={updatePasswordResult.isLoading}
      />
    </View>
  );
};

export default EditPassword;
