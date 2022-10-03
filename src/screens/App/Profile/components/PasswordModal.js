import { useState, useEffect } from "react";
import { Button } from "@rneui/themed";
import { Dialog, Input } from "@rneui/themed";
import { Text } from "../../../../components";
import { useTheme } from "@rneui/themed";
import { useFormik } from "formik";
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/Ionicons";

const PasswordModal = ({
  isVisible,
  onPress,
  onCancel,
  isLoading,
  serverError,
  isSuccess,
}) => {
  const { theme } = useTheme();
  const [error, setError] = useState("");
  const [secretMap, setSecretMap] = useState({});

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      comnfirmNewPassword: "",
    },
    onSubmit: (values) => {
      if (values.oldPassword === "") {
        setError("Please enter current password");
      } else if (
        values.newPassword === "" ||
        values.comnfirmNewPassword === ""
      ) {
        setError("Please enter new password values");
      } else if (
        values.newPassword.length < 6 ||
        values.comnfirmNewPassword.length < 6
      ) {
        setError("6 Characters minimum");
      } else if (values.newPassword !== values.comnfirmNewPassword) {
        setError("New password values do not match");
      } else {
        onPress(values);
      }
    },
  });

  useEffect(() => {
    setError("");
  }, [formik.values]);

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      onCancel();
    }
  }, [isSuccess]);

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };

  const handleClose = () => {
    formik.resetForm();
    onCancel();
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={handleClose}>
      <Text type="h2" color="black">
        Change Password
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Enter your current password, and your new one.
      </Text>

      <View
        style={{ display: "flex", height: 180, justifyContent: "space-around" }}
      >
        <Input
          onChangeText={formik.handleChange("oldPassword")}
          onBlur={formik.handleBlur("oldPassword")}
          value={formik.values.oldPassword}
          placeholder="Enter current password"
          secureTextEntry={secretMap["oldPassword"] ? true : false}
          rightIcon={
            <MaterialIcons
              name={secretMap["oldPassword"] ? "eye-off" : "eye"}
              onPress={handlePassToggle("oldPassword")}
              color="#6B7280"
              style={{ fontSize: 22 }}
            />
          }
        />
        <Input
          onChangeText={formik.handleChange("newPassword")}
          onBlur={formik.handleBlur("newPassword")}
          value={formik.values.newPassword}
          placeholder="Enter new password"
          secureTextEntry={secretMap["newPassword"] ? true : false}
          rightIcon={
            <MaterialIcons
              name={secretMap["newPassword"] ? "eye-off" : "eye"}
              onPress={handlePassToggle("newPassword")}
              color="#6B7280"
              style={{ fontSize: 22 }}
            />
          }
        />
        <Input
          onChangeText={formik.handleChange("comnfirmNewPassword")}
          onBlur={formik.handleBlur("comnfirmNewPassword")}
          value={formik.values.comnfirmNewPassword}
          placeholder="Confirm new password"
          secureTextEntry={secretMap["comnfirmNewPassword"] ? true : false}
          rightIcon={
            <MaterialIcons
              name={secretMap["comnfirmNewPassword"] ? "eye-off" : "eye"}
              onPress={handlePassToggle("confirmNewPassword")}
              color="#6B7280"
              style={{ fontSize: 22 }}
            />
          }
        />
      </View>
      <View style={{ height: 20 }}>
        {error || serverError ? (
          <Text type="h4" color="error">
            {error || serverError}
          </Text>
        ) : null}
      </View>

      <Dialog.Actions>
        <Button
          onPress={handleOnSubmit}
          title="Save"
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
          disabled={isLoading}
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={handleClose}
          type="clear"
          disabled={isLoading}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default PasswordModal;
