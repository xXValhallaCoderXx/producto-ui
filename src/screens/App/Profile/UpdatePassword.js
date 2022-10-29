import { useState, useEffect } from "react";
import * as Yup from "yup";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { useTheme } from "react-native-paper";
import { View } from "react-native";
import { useUpdatePasswordMutation } from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";
import ProductoInput from "../../../components/Input";
const EditPassword = ({ navigation }) => {
  const theme = useTheme();
  const toast = useToast();
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
        .required("Password field is required"),
    }),

    onSubmit: async ({ currentPassword, newPassword }) => {
      await updatePassword({ newPassword, currentPassword });
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
      navigation.navigate("Accounts");
    }
    if (updatePasswordResult.isError) {
      const message = Array.isArray(updatePasswordResult?.error?.data?.message)
        ? updatePasswordResult?.error?.data?.message[0]
        : updatePasswordResult?.error?.data?.message;
      toast.show("Password succesffully updated", {
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

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };
  console.log("FORMIK: ", formik.isValid);
  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Enter your current password, and your new password you wish to change
        to.
      </Text>

      <ProductoInput
        label="Password"
        placeholder="Enter current password"
        value={formik.values.currentPassword}
        onChange={formik.handleChange("currentPassword")}
        autoFocus
        onBlur={formik.handleBlur("currentPassword")}
        secureTextEntry={secretMap["currentPassword"]}
        right={
          <TextInput.Icon
            style={{ paddingTop: 8 }}
            onPress={handlePassToggle("currentPassword")}
            icon={secretMap["currentPassword"] ? "eye-off" : "eye"}
          />
        }
      />

      <View style={{ height: 20, marginBottom: 10 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.currentPassword || ""}
        </Text>
      </View>

      <ProductoInput
        label="New Password"
        placeholder="Enter new password"
        value={formik.values.newPassword}
        onChange={formik.handleChange("newPassword")}
        autoFocus
        onBlur={formik.handleBlur("newPassword")}
        secureTextEntry={secretMap["newPassword"]}
        right={
          <TextInput.Icon
            style={{ paddingTop: 8 }}
            onPress={handlePassToggle("newPassword")}
            icon={secretMap["newPassword"] ? "eye-off" : "eye"}
          />
        }
      />

      <View style={{ height: 20, marginBottom: 10 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.newPassword || ""}
        </Text>
      </View>

      <ProductoInput
        label="Confirm Password"
        placeholder="Confirm new password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange("confirmPassword")}
        autoFocus
        onBlur={formik.handleBlur("confirmPassword")}
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
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.confirmPassword || ""}
        </Text>
      </View>

      <ProductoButton
        title="Change Password"
        type="contained"
        style={{ marginTop: 30 }}
        onPress={handleOnSubmit}
        disabled={
          updatePasswordResult.isLoading || !formik.isValid || !formik.dirty
        }
        loading={updatePasswordResult.isLoading}
      />
    </View>
  );
};

export default EditPassword;
