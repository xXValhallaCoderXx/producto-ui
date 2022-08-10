import axios from "axios";
import Constants from "expo-constants";
import { useState } from "react";
import { Text, Card, Input, Button } from "@rneui/themed";
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
      <View style={styles.titleContainer}>
        <Text style={{ color: theme.colors.primary }} h1>
          Producto
        </Text>
        <Text style={{ color: "black" }} h4>
          Unleash Your Creativity
        </Text>
      </View>
      <Card containerStyle={styles.loginCard}>
        <Text
          color="primary"
          style={{
            color: theme.colors.primary,
            textAlign: "center",
            marginBottom: 10,
          }}
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
          disabled={!email || !password}
          loading={loading}
          title="Submit"
          onPress={handleOnSubmit}
          color={theme.colors.primary}
        />
      </Card>
      <Text style={{ color: theme.colors.primary, marginTop: 20 }} h4>
        Not boosting your productivity?
      </Text>
      <Text
        onPress={() => navigation.navigate("Registration")}
        style={{
          color: "black",
          marginTop: 15,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        Sign Up Here
      </Text>
      <Image
        style={{ width: 40, height: 40, marginTop: 100 }}
        source={require("./water.gif")}
      />
      <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
        Bloop Studios
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
    // justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    borderColor: "#5048E5",
    marginTop: 125,
    minWidth: 300,
    maxWidth: 350,
    borderRadius: 6,
    display: "flex",
    padding: 30
  },
});

export default LoginScreen;
