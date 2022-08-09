import axios from "axios";
import { useState, useEffect } from "react";
import { Text, Card, Input, Button } from "@rneui/themed";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ToastAndroid,
} from "react-native";

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleOnSubmit = () => {
    if (email && password) {
      axios
        .post(
          `https://d916-2406-3003-2007-179f-e813-ef88-75d1-6623.ngrok.io/api/v1/auth/register`,
          {
            username: email,
            password: password,
          }
        )
        .then((response) => {
            console.log("what is this: ", response)
          JwtService.setToken(response.data.access_token);
        })
        .catch((err) => {
          console.log(err.response);
          ToastAndroid.show("Error registering user", ToastAndroid.SHORT);
          setError("Credentials already used");
        });
    }
    //
  };

  useEffect(() => {
    if(password !== confirmPassword){
        setError("Passwords do not match!")
    }
  }, [confirmPassword])
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
          disabled={!email || !password || !confirmPassword && !error}
          title="Submit"
          onPress={handleOnSubmit}
        />
      </Card>
      <Text style={{ color: "#007ea7", marginTop: 20 }} h4>
        Already have an account?
      </Text>
      <Text
        onPress={() => navigation.navigate("Login")}
        style={{ color: "white", marginTop: 20, fontSize: 20 }}
      >
        Log-in<Text style={{ fontWeight: "bold", color: "white" }}>Here</Text>
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

export default RegisterScreen;
