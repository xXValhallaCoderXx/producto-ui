import { useState, useEffect } from "react";
import LayoutView from "../../../components/LayoutView";
import * as Yup from "yup";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { useTheme } from "react-native-paper";
import { View } from "react-native";

import { useUpdateEmailMutation } from "../../../api/auth-api";

const UpdateEmail = ({ route, navigation }) => {
  const theme = useTheme();
  const [secretMap, setSecretMap] = useState({});
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
        .required("Password field is required"),
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
    }),

    onSubmit: async ({ email, password }) => {
      await updateEmail({ email, password });
    },
  });
  //     formik.resetForm();
  useEffect(() => {
    // setError("");
  }, [formik.values]);

  useEffect(() => {
    console.log("UPDATE EMAIL", updateEmail);
  }, [updateEmailResult]);

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Enter your current password, and your new email you would like to change
        to.
      </Text>

      <TextInput
        onChangeText={formik.handleChange("password")}
        autoFocus
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        mode="outlined"
        label="Password"
        placeholder="Enter current password"
        style={{
          backgroundColor: "white",
        }}
        secureTextEntry={secretMap["password"] ? true : false}
        right={
          <TextInput.Icon onPress={handlePassToggle("password")} icon="eye" />
        }
      />

      <View style={{ height: 20 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.password || ""}
        </Text>
      </View>

      <TextInput
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        mode="outlined"
        label="New Email"
        placeholder="Enter a new email"
        style={{
          marginTop: 15,
          backgroundColor: "white",
        }}
      />
      <View style={{ height: 20 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.email || ""}
        </Text>
      </View>

      <ProductoButton
        title="Change Email"
        type="contained"
        style={{ marginTop: 30 }}
        onPress={handleOnSubmit}
      />
    </View>
  );
};

export default UpdateEmail;
