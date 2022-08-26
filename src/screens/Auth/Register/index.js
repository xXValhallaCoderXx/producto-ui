import { useState, useEffect } from "react";
import { useTheme } from "@rneui/themed";
import { TextInput } from "react-native";
import { useRegisterMutation } from "../../../api/auth-api";
import { Text, Card, Input, Button } from "@rneui/themed";
import { StyleSheet, Platform, View, ToastAndroid, Image } from "react-native";
import httpClient from "../../../api/api-handler";

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerApi, registerApiResult] = useRegisterMutation();

  useEffect(() => {
    if (registerApiResult.isError) {
      ToastAndroid.show("Error registering user", ToastAndroid.SHORT);
    }
  }, [registerApiResult.isError]);

  useEffect(() => {
    if (registerApiResult.isSuccess) {
      ToastAndroid.show("Registration success", ToastAndroid.SHORT);
      navigation.navigate("Login");
    }
  }, [registerApiResult.isSuccess]);

  const handleOnSubmit = async () => {
    setError("");

    if (email && password) {
      await registerApi({ email, password });
      //   try {
    }

    //   } catch (err) {
    //     // setIsLoading(false);
    //     console.log("ERR: ", err.response.data)
    //     // ToastAndroid.show("Error registering user", ToastAndroid.SHORT);
    //     if (err.response.status === 400) {
    //       if(Array.isArray(err.response.data.message)){
    //         setError(err.response.data.message[0]);
    //       } else {
    //         setError(err.response.data.message);
    //       }

    //     } else {
    //       setError("Sorry, an error occured");
    //     }
    //   }
    // } else {
    //   setError("Please fill in all required fields")
    // }
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError("");
    }
  }, [confirmPassword, password]);

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        style={{ height: 40, width: 220, marginBottom: 40 }}
        source={require("../../../assets/images/title-dark.png")}
      />

      <TextInput
        style={styles.input}
        onChangeText={(value) => {
          setError("");
          setEmail(value);
        }}
        value={email}
        nativeID="email"
        placeholder="Email"
      />
      <TextInput
        style={{ ...styles.input, marginTop: 20, marginBottom: 20 }}
        onChangeText={(value) => {
          setError("");
          setPassword(value);
        }}
        value={password}
        nativeID="password"
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setConfirmPassword(value)}
        value={confirmPassword}
        nativeID="confirmPassword"
        placeholder="Confirm Password"
        secureTextEntry={true}
      />
      <View style={{ height: 20, marginTop: 10, marginBottom: 10 }}>
        {(error && (
          <Text
            style={{
              color: "#D14343",
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            {error}
          </Text>
        )) ||
          null}
      </View>
      {/* 
       Object.entries(errors)
      {(error && (
        <Text
          style={{
            color: "#f43a3a",
            textAlign: "center",
            fontWeight: "700",
            marginTop: 5,
            marginBottom: 10,
          }}
        >
          {error}
        </Text>
      )) ||
        null} */}
      <Button
        loading={registerApiResult.isLoading}
        buttonStyle={{
          borderRadius: 8,
          padding: 10,
          minWidth: 200,
        }}
        // disabled={!email || !password || (!confirmPassword && !error)}
        title="Register"
        onPress={handleOnSubmit}
        color="primary"
      />

      <Text style={{ color: theme.colors.primary, marginTop: 20 }} h5>
        Already have an account?
      </Text>
      <Text
        h6
        onPress={() => navigation.navigate("Login")}
        style={{
          color: "black",
          marginTop: 5,
          fontWeight: "700",
        }}
      >
        Log-in Here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
    height: 45,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default RegisterScreen;
