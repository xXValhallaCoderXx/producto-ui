import { useState, useEffect } from "react";
import LayoutView from "../../../components/LayoutView";
import * as Yup from "yup";
import * as SecureStore from "expo-secure-store";
import { useToast } from "react-native-toast-notifications";
import ProductoButton from "../../../components/Button";
import { TextInput, Text, useTheme } from "react-native-paper";
import { useFormik } from "formik";
import { View, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useUpdateEmailMutation } from "../../../api/auth-api";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";

const UpdateEmail = ({ route, navigation }) => {
  const theme = useTheme();
  const toast = useToast();
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
      const result = await updateEmail({ email, password });
      const { tokens } = result.data;

      await SecureStore.setItemAsync(JWT_KEY_STORE, tokens.accessToken);
      await SecureStore.setItemAsync(
        REFRESH_JWT_KEY_STORE,
        tokens.refreshToken
      );
      navigation.navigate("Accounts");
      toast.show("Email succesffully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Succesfully updated email!",
        description: "You may now login with your new email",
      });
    },
  });

  const handlePassToggle = (key) => () => {
    setSecretMap({
      ...secretMap,
      [key]: secretMap[key] ? false : true,
    });
  };

  useEffect(() => {
    if (updateEmailResult.isSuccess) {
      console.log("UPDATE SUCCESS: ", updateEmailResult)
    }
    if (updateEmailResult.isError) {
      console.log("UPDATE ERROR: ", updateEmailResult)
    }
  }, [updateEmailResult]);

  //   const handleChangeEmail = async (values) => {
  //     try {
  //       // unwrapping will cause data to resolve, or an error to be thrown, and will narrow the types
  //       const result = await updateEmailApi({
  //         password: values.password,
  //         email: values.email,
  //       });

  //       // refetch(); // you should most likely just use tag invalidation here instead of calling refetch
  //     } catch (error) {
  //       console.log("ERROR: ", error);
  //     }
  //   };

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
        secureTextEntry={secretMap["password"]}
        right={<TextInput.Icon style={{paddingBottom: 2}} onPress={handlePassToggle("password")} icon="eye" /> }
      />

      <View style={{ height: 20, marginBottom: 10 }}>
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
        keyboardType="email-address"
        style={{
          marginTop: 5,
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
        onPress={formik.handleSubmit}
        loading={updateEmailResult.isLoading}
        disabled={updateEmailResult.isLoading}
      />
    </View>
  );
};

export default UpdateEmail;
