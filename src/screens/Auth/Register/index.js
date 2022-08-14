import axios from "axios";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { useTheme } from "@rneui/themed";
import { TextInput } from "react-native";
import { Text, Card, Input, Button } from "@rneui/themed";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ToastAndroid,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleOnSubmit = () => {
    setError("");
    setLoading(true);
    if (email && password) {
      axios
        .post(`${Constants.manifest.extra.baseUrl}/api/v1/auth/register`, {
          username: email,
          password: password,
        })
        .then((response) => {
          //   JwtService.setToken(response.data.access_token);
          setLoading(false);
          ToastAndroid.show("Registration successful", ToastAndroid.SHORT);
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log(err.response);
          ToastAndroid.show("Error registering user", ToastAndroid.SHORT);
          setError("Credentials already used");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError("");
    }
  }, [confirmPassword, password]);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={{ color: theme.colors.primary, marginBottom: 50 }} h1>
        Producto
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={(value) => setEmail(value)}
        value={email}
        nativeID="email"
        placeholder="Enter"
      />
      <TextInput
        style={{ ...styles.input, marginTop: 20, marginBottom: 20 }}
        onChangeText={(value) => setPassword(value)}
        value={password}
        nativeID="password"
        placeholder="Password"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setConfirmPassword(value)}
        value={confirmPassword}
        nativeID="confirmPassword"
        placeholder="Confirm Password"
      />

      {(error && (
        <Text
          style={{
            color: "red",
            textAlign: "center",
            fontWeight: "700",
            marginTop: -10,
            marginBottom: 10,
          }}
        >
          {error}
        </Text>
      )) ||
        null}
      <Button
        loading={loading}
        buttonStyle={{
          borderRadius: 8,
          padding: 10,
          minWidth: 200,
          marginTop: 40,
        }}
        disabled={!email || !password || (!confirmPassword && !error)}
        title="Submit"
        onPress={handleOnSubmit}
        color="#6F0DB3"
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
    </KeyboardAvoidingView>
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
