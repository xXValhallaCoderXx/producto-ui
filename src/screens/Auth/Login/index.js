import axios from "axios";
import Constants from "expo-constants";
import { useState } from "react";
import { TextInput } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import JwtService from "../../../services/auth-service";
import { useTheme } from "@rneui/themed";
import { StackActions } from "@react-navigation/native";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  ToastAndroid,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleOnSubmit = () => {
    if (email && password) {
      setLoading(true);
      axios
        .post(`${Constants.manifest.extra.baseUrl}/api/v1/auth/login`, {
          username: email,
          password: password,
        })
        .then((response) => {
          setLoading(false);
          JwtService.setToken(response.data.access_token);
          ToastAndroid.show("Login success", ToastAndroid.SHORT);
          navigation.dispatch(StackActions.replace("App"));
        })
        .catch((err) => {
          setLoading(false);
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
     <Text style={{ color: theme.colors.primary, marginBottom: 50 }} h1>
          Producto
        </Text>
    
    
        <TextInput
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          value={email}
          nativeID="email"
          placeholder="Email"
        />
        <TextInput
          style={{...styles.input, marginTop: 20, marginBottom: 40}}
          onChangeText={(value) => setPassword(value)}
          value={password}
          nativeID="password"
          placeholder="Password"
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
          disabled={!email || !password}
          loading={loading}
          title="Log in"
          buttonStyle={{borderRadius: 8, padding: 10, minWidth: 200}}
          onPress={handleOnSubmit}
          color={theme.colors.primary}
        />
  
      <Text style={{ color: theme.colors.primary, marginTop: 20 }} h5>
        Not boosting your productivity?
      </Text>
      <Text
      h6
        onPress={() => navigation.navigate("Registration")}
        style={{
          color: "black",
          marginTop: 5,
          fontWeight: "700"
    
        }}
      >
        Sign Up Here
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
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8, 
    fontSize: 16,
  }
});

export default LoginScreen;
