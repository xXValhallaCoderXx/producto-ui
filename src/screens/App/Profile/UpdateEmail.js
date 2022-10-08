import { useState, useEffect } from "react";
import LayoutView from "../../../components/LayoutView";

import { useTheme } from "@rneui/themed";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { View } from "react-native";

const UpdateEmail = ({ route, navigation }) => {
  const { theme } = useTheme();
  const [error, setError] = useState("");
  const [secretMap, setSecretMap] = useState({});
  const { email } = route.params;

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    onSubmit: (values) => {
      if (values.password === "") {
        setError("Please enter password");
      } else if (values.password === "" || values.email === "") {
        setError("Please enter all required fields");
      } else {
      }
    },
  });

  useEffect(() => {
    setError("");
  }, [formik.values]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     formik.resetForm();
  //     onCancel();
  //   }
  // }, [isSuccess]);

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };

  const handleClose = () => {
    formik.resetForm();
    // onCancel();
  };

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: "Update Email" });
  }, []);

  const handleOnPress = () => {
    navigation.navigate("Accounts");
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

      <TextInput
        onChangeText={formik.handleChange("email")}
        onBlur={formik.handleBlur("email")}
        value={formik.values.email}
        mode="outlined"
        label="New Email"
        placeholder="Enter a new email"
        style={{
          marginTop: 25,
          backgroundColor: "white",
          marginBottom: 40,
        }}
      />

      {/* <View style={{ height: 20 }}>
          {error || serverError ? (
            <Text type="h4" color="error">
              {error || serverError}
            </Text>
          ) : null}
        </View> */}
      <ProductoButton title="Change Email" type="contained" />
    </View>
  );
};

export default UpdateEmail;
