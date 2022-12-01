import { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { TextInput, Text, useTheme } from "react-native-paper";
import { View, ScrollView } from "react-native";
import Input from "../../../components/Input";
import { useFormik } from "formik";
import ContainedButton from "../../../components/ContainedButton";
import { useUpdateEmailMutation } from "../../../api/auth-api";
import { useToast } from "react-native-toast-notifications";

const UpdateEmailScreen = ({ navigation }) => {
  const theme = useTheme();
  const passInputRef = useRef(null);
  const toast = useToast();
  const [updateEmail, updateEmailResult] = useUpdateEmailMutation();
  console.log("UPAPAPA:E", updateEmailResult)
  useEffect(() => {
    navigation.setOptions({ title: "Update E-mail" });
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

      if (!result.error) {
        const { tokens } = result?.data;
        await SecureStore.setItemAsync(JWT_KEY_STORE, tokens.accessToken);
        await SecureStore.setItemAsync(
          REFRESH_JWT_KEY_STORE,
          tokens.refreshToken
        );
      }
    },
  });

  useEffect(() => {
    if (updateEmailResult.isSuccess) {
      toast.show("Email succesfully updated", {
        type: "success",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Succesfully updated email!",
        description: "You may now login with your new email",
      });
      navigation.navigate("Settings");
    }
    if (updateEmailResult.isError) {
      const message = Array.isArray(updateEmailResult?.error?.data?.message)
        ? updateEmailResult?.error?.data?.message[0]
        : updateEmailResult?.error?.data?.message;

      toast.show("Email update error", {
        type: "warning",
        duration: 2500,
        offset: 30,
        animationType: "zoom-in",
        placement: "bottom",
        title: "Error updating email!",
        description: message ?? "Sorry, an error occured",
      });
    }
  }, [updateEmailResult]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      passInputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

  const [secretMap, setSecretMap] = useState({
    password: true,
  });

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
        padding: 25,
      }}
    >
      <ScrollView keyboardShouldPersistTaps="always" style={{ padding: 5 }}>
        <View>
          <Text style={{ marginBottom: 15 }}>
            Enter your current password, and your new email you would like to
            change to.
          </Text>

          <Input
            label="Password"
            placeholder="Enter current password"
            value={formik.values.password}
            onChange={formik.handleChange("password")}
            ref={passInputRef}
            secureTextEntry={secretMap["password"]}
            right={
              <TextInput.Icon
                style={{ paddingTop: 8 }}
                onPress={handlePassToggle("password")}
                icon={secretMap["password"] ? "eye-off" : "eye"}
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
              {(formik?.touched?.password && formik?.errors?.password) || ""}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Input
              label="E-mail"
              placeholder="Enter your new e-mail"
              onChange={formik.handleChange("email")}
              value={formik.values.email}
            />
          </View>
          <View style={{ height: 20 }}>
            <Text
              style={{
                marginTop: 5,
                marginLeft: 10,
                color: theme.colors.error,
              }}
            >
              {(formik?.touched?.email && formik?.errors?.email) || ""}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingTop: 25, paddingBottom: 20 }}>
        <ContainedButton
          onPress={formik.handleSubmit}
          disabled={updateEmailResult.isLoading}
          loading={updateEmailResult.isLoading}
        >
          Change Email
        </ContainedButton>
      </View>
    </View>
  );
};

export default UpdateEmailScreen;
