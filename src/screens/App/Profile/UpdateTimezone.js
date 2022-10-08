import { useState, useEffect } from "react";
import LayoutView from "../../../components/LayoutView";
import * as Yup from "yup";
import ProductoButton from "../../../components/Button";
import { TextInput, Text } from "react-native-paper";
import { useFormik } from "formik";
import { useTheme } from "react-native-paper";
import { View } from "react-native";

const UpdateTimezone = ({ route, navigation }) => {
  const theme = useTheme();
  const [secretMap, setSecretMap] = useState({});
  //   const [updateEmail, updateEmailResult] = useUpdateEmailMutation();

  useEffect(() => {
    navigation.setOptions({ title: "Update Timezone" });
  }, []);

  const formik = useFormik({
    initialValues: {
      timezone: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(6, "Please enter a minimum of 6 characters")
        .max(50, "Password exceeded 50 characters")
        .required("Password field is required"),
    }),

    onSubmit: async ({ timezone }) => {
      //   await updateEmail({ email, password });
    },
  });

  //   useEffect(() => {
  //     console.log("UPDATE EMAIL", updateEmail);
  //   }, [updateEmailResult]);

  const handleOnSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, padding: 30, paddingTop: 20 }}
    >
      <Text style={{ marginBottom: 15 }}>
        Select which timezone, so we know when your day has ended
      </Text>

      <TextInput
        onChangeText={formik.handleChange("password")}
        autoFocus
        onBlur={formik.handleBlur("password")}
        value={formik.values.password}
        mode="outlined"
        label="Timezone"
        placeholder="Enter current timezone"
        style={{
          backgroundColor: "white",
        }}
        secureTextEntry={secretMap["password"] ? true : false}
      />

      <View style={{ height: 20 }}>
        <Text
          style={{ marginTop: 5, marginLeft: 10, color: theme.colors.error }}
        >
          {formik?.errors?.password || ""}
        </Text>
      </View>

      <ProductoButton
        title="Change Timezone"
        type="contained"
        style={{ marginTop: 30 }}
        onPress={handleOnSubmit}
      />
    </View>
  );
};

export default UpdateTimezone;
