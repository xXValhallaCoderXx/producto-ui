import axios from "axios";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { Text, Card, Input, Button } from "@rneui/themed";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ToastAndroid,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
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
      <View style={styles.titleContainer}>
        <Text style={{ color: "white" }} h1>
          Producto
        </Text>
        <Text style={{ color: "white" }} h4>
          Unleash Your Creativity
        </Text>
      </View>
      <Card containerStyle={styles.loginCard}>
        <Text
          style={{ color: "#6F0DB3", textAlign: "center", marginBottom: 10 }}
          h2
        >
          Registration
        </Text>
        <Input
          onChangeText={(value) => setEmail(value)}
          value={email}
          nativeID="email"
          placeholder="Enter your email..."
        />
        <Input
          onChangeText={(value) => setPassword(value)}
          value={password}
          nativeID="password"
          placeholder="Enter your password..."
        />
        <Input
          onChangeText={(value) => setConfirmPassword(value)}
          value={confirmPassword}
          nativeID="confirmPassword"
          placeholder="Confirm your password..."
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
          disabled={!email || !password || (!confirmPassword && !error)}
          title="Submit"
          onPress={handleOnSubmit}
          color="#6F0DB3"
        />
      </Card>
      <Text style={{ color: "white", marginTop: 20 }} h4>
        Already have an account?
      </Text>
      <Text
        onPress={() => navigation.navigate("Login")}
        style={{ color: "white", marginTop: 20, fontSize: 20 }}
      >
        Log-in <Text style={{ fontWeight: "bold", color: "white" }}>Here</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F0DB3",
    display: "flex",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    marginTop: 75,
    minWidth: 300,
    maxWidth: 350,
    borderRadius: 6,
    display: "flex",
  },
});

export default RegisterScreen;
