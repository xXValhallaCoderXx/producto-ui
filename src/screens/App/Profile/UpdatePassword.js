import { useState, useEffect } from "react";
import LayoutView from "../../../components/LayoutView";
import * as Yup from "yup";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { useTheme } from "react-native-paper";
import { View } from "react-native";
import { useUpdatePasswordMutation } from "../../../api/user-api";

const EditPassword = ({ route, navigation }) => {
  const theme = useTheme();
  const [secretMap, setSecretMap] = useState({});
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

    onSubmit: async ({ confirmPassword, currentPassword, newPassword }) => {
      await updatePassword({ newPassword, currentPassword, confirmPassword });
    },
  });

  useEffect(() => {
    console.log("UPDATE EMAIL", updatePasswordResult);
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

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Enter your current password, and your new one.
      </Text>

      <TextInput
        onChangeText={formik.handleChange("currentPassword")}
        autoFocus
        onBlur={formik.handleBlur("currentPassword")}
        value={formik.values.currentPassword}
        mode="outlined"
        label="Password"
        placeholder="Enter current password"
        style={{
          backgroundColor: "white",
        }}
        secureTextEntry={secretMap["currentPassword"] ? true : false}
        right={
          <TextInput.Icon
            onPress={handlePassToggle("currentPassword")}
            icon="eye"
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

      <TextInput
        onChangeText={formik.handleChange("newPassword")}
        onBlur={formik.handleBlur("newPassword")}
        value={formik.values.newPassword}
        mode="outlined"
        label="New Password"
        placeholder="Enter new password"
        style={{
          backgroundColor: "white",
        }}
        secureTextEntry={secretMap["newPassword"] ? true : false}
        right={
          <TextInput.Icon
            onPress={handlePassToggle("newPassword")}
            icon="eye"
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

      <TextInput
        onChangeText={formik.handleChange("confirmPassword")}
        onBlur={formik.handleBlur("confirmPassword")}
        value={formik.values.confirmPassword}
        mode="outlined"
        label="Confirm Password"
        placeholder="Confirm new password"
        style={{
          backgroundColor: "white",
        }}
        secureTextEntry={secretMap["confirmPassword"] ? true : false}
        right={
          <TextInput.Icon
            onPress={handlePassToggle("confirmPassword")}
            icon="eye"
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
      />
    </View>
  );
};

export default EditPassword;
