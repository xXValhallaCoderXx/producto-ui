import axios from "axios";
import Constants from 'expo-constants'
import { useState } from "react";
import { Text, Card, Input, Button } from "@rneui/themed";
import JwtService from "../../../services/auth-service"
import { StackActions } from '@react-navigation/native';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ToastAndroid,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleOnSubmit = () => {
    if (email && password) {
      axios
        .post(
          `${Constants.manifest.extra.baseUrl}/api/v1/auth/login`,
          {
            username: email,
            password: password,
          }
        )
        .then((response) => {
          console.log("RESPONSE: ", response.data);
          JwtService.setToken(response.data.access_token);
          // navigation.navigate("Dashboard")
          navigation.dispatch(
            StackActions.replace('App')
          );
        })
        .catch((err) => {
          console.log(err);
          ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
          setError("Invalid username / password");
        });
    }
    //
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.titleContainer}>
        <Text style={{ color: "#00a8e8" }} h1>
          Producto
        </Text>
        <Text style={{ color: "#007ea7" }} h4>
          Unleash Your Creativity
        </Text>
      </View>
      <Card containerStyle={styles.loginCard}>
        <Text
          style={{ color: "#007ea7", textAlign: "center", marginBottom: 10 }}
          h2
        >
          Login
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
            Invalid username / password
          </Text>
        )) ||
          null}
        <Button
          // disabled={!email || !password}
          title="Submit"
          onPress={handleOnSubmit}
        />
      </Card>
      <Text style={{ color: "#007ea7", marginTop: 20 }} h4>
        Not boosting your productivity?
      </Text>
      <Text
        onPress={() => navigation.navigate("Registration")}
        style={{ color: "white", marginTop: 20, fontSize: 20 }}
      >
        Sign Up <Text style={{ fontWeight: "bold", color: "white" }}>Here</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003459",
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
    marginTop: 125,
    minWidth: 300,
    maxWidth: 350,
    borderRadius: 6,
    display: "flex",
  },
});

export default LoginScreen;
