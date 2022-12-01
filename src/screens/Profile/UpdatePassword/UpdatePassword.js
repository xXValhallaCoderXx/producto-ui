import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { TextInput, Text, useTheme } from "react-native-paper";
import { useFormik } from "formik";
import { View, ScrollView } from "react-native";
import Input from "../../../components/Input";
import ContainedButton from "../../../components/ContainedButton";
import { useUpdatePasswordMutation } from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";

const UpdatePasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const passInputRef = useRef(null);
  const toast = useToast();
  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();

  const [secretMap, setSecretMap] = useState({
    newPassword: true,
    currentPassword: true,
    confirmPassword: true,
  });

  useEffect(() => {
    navigation.setOptions({ title: "Change Password" });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      passInputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

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
        .required("Current password field is required"),
      newPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("New password field is required"),
      confirmPassword: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Confirm new password field is required"),
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
      navigation.navigate("Settings");
    }
    if (updatePasswordResult.isError) {
      const message = Array.isArray(updatePasswordResult?.error?.data?.message)
        ? updatePasswordResult?.error?.data?.message[0]
        : updatePasswordResult?.error?.data?.message;
      toast.show("Error updating password", {
        type: "warning",
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

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        padding: 30,
        paddingTop: 20,
        justifyContent: "space-between",
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginBottom: 15 }}>
            Enter your current password, and your new password you wish to
            change to.
          </Text>

          <Input
            label="Current Password"
            placeholder="Enter current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange("currentPassword")}
            ref={passInputRef}
            secureTextEntry={secretMap["currentPassword"]}
            right={
              <TextInput.Icon
                style={{ paddingTop: 8 }}
                onPress={handlePassToggle("currentPassword")}
                icon={secretMap["currentPassword"] ? "eye-off" : "eye"}
              />
            }
          />

          <View style={{ height: 20, marginBottom: 15 }}>
            <Text
              style={{
                marginTop: 5,
                marginLeft: 10,
                color: theme.colors.error,
              }}
            >
              {formik?.touched?.currentPassword && formik?.errors?.currentPassword || ""}
            </Text>
          </View>

          <Input
            label="New Password"
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange("newPassword")}
            secureTextEntry={secretMap["newPassword"]}
            right={
              <TextInput.Icon
                style={{ paddingTop: 8 }}
                onPress={handlePassToggle("newPassword")}
                icon={secretMap["newPassword"] ? "eye-off" : "eye"}
              />
            }
          />

          <View style={{ height: 20, marginBottom: 15 }}>
            <Text
              style={{
                marginTop: 5,
                marginLeft: 10,
                color: theme.colors.error,
              }}
            >
              {formik?.touched?.newPassword && formik?.errors?.newPassword || ""}
            </Text>
          </View>

          <Input
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange("confirmPassword")}
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
              {formik?.touched?.confirmPassword && formik?.errors?.confirmPassword || ""}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View>
        <ContainedButton
          onPress={formik.handleSubmit}
          disabled={updatePasswordResult.isLoading}
          loading={updatePasswordResult.isLoading}
        >
          Change Password
        </ContainedButton>
      </View>
    </View>
  );
};

export default UpdatePasswordScreen;
