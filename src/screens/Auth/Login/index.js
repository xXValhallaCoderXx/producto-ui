import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated } from "react-native";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import httpClient from "../../../api/api-handler";
const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async (e) => {
      setError("");
      setEmail("");
      setPassword("");
    });
    // Unsubscribe to event listener when component unmount
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleOnSubmit = async () => {
    if (email && password) {
      setIsLoading(true);

      try {
        const response = await httpClient.post("/auth/login", {
          email,
          password,
        });
        setIsLoading(false);
        await AsyncStorage.setItem(
          "@producto-jwt-token",
          response.data.access_token
        );
        ToastAndroid.show("Login success", ToastAndroid.SHORT);
        navigation.dispatch(StackActions.replace("App"));
      } catch (err) {
        setIsLoading(false);
        if (err.response.status === 400) {
          setError(err.response.data.message);
        } else {
          setError("Sorry, an error occured");
        }
      }
    }
  };
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
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
        style={{ ...styles.input, marginTop: 20, marginBottom: 40 }}
        onChangeText={(value) => {
          setError("");
          setPassword(value);
        }}
        value={password}
        nativeID="password"
        placeholder="Password"
        secureTextEntry={true}
      />
      <View style={{ height: 10 }}>
        {(error && (
          <Text
            style={{
              color: "#D14343",
              textAlign: "center",
              fontWeight: "700",
              marginTop: -25,
              marginBottom: 10,
            }}
          >
            {error}
          </Text>
        )) ||
          null}
      </View>
      <Button
        disabled={!email || !password}
        loading={isLoading}
        title="Log in"
        buttonStyle={{ borderRadius: 8, padding: 10, minWidth: 200 }}
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
          fontWeight: "700",
        }}
      >
        Sign Up Here
      </Text>
    </Animated.View>
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

export default LoginScreen;
