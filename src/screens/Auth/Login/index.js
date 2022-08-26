import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated } from "react-native";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import { useLoginMutation } from "../../../api/auth-api";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loginApi, loginApiResult] = useLoginMutation();

  useEffect(() => {
    // handleInit();
    const unsubscribe = navigation.addListener("blur", async (e) => {
      setEmail("");
      setPassword("");
      loginApiResult.reset();
    });
    // Unsubscribe to event listener when component unmount
    return () => unsubscribe();
  }, []);

  const handleInit = async () => {
    const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
    if (jwtToken) {
      navigation.dispatch(StackActions.replace("App"));
    }
  };

  useEffect(() => {
    if (loginApiResult.isError) {
      ToastAndroid.show("Incorrect Credentials", ToastAndroid.SHORT);
    }
  }, [loginApiResult.isError]);

  useEffect(() => {
    if (loginApiResult.isSuccess) {
      setTokenAndRedirect(loginApiResult.data.access_token);
    }
  }, [loginApiResult.isSuccess]);

  setTokenAndRedirect = async (token) => {
    await AsyncStorage.setItem("@producto-jwt-token", token);
    ToastAndroid.show("Login success", ToastAndroid.SHORT);
    navigation.dispatch(StackActions.replace("App"));
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleOnSubmit = async () => {
    if (email && password) {
      const res = await loginApi({ email, password });
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
          setEmail(value);
        }}
        value={email}
        nativeID="email"
        placeholder="Email"
      />
      <TextInput
        style={{ ...styles.input, marginTop: 20, marginBottom: 40 }}
        onChangeText={(value) => {
          setPassword(value);
        }}
        value={password}
        nativeID="password"
        placeholder="Password"
        secureTextEntry={true}
      />
      <View style={{ height: 10 }}>
        {(loginApiResult.isError && (
          <Text
            style={{
              color: "#D14343",
              textAlign: "center",
              fontWeight: "700",
              marginTop: -25,
              marginBottom: 10,
            }}
          >
            {loginApiResult.error.data.message}
          </Text>
        )) ||
          null}
      </View>
      <Button
        disabled={!email || !password}
        loading={loginApiResult.isLoading}
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
