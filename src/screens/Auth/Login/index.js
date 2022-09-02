import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated, KeyboardAvoidingView } from "react-native";
import { Text, Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import { useLoginMutation } from "../../../api/auth-api";
import { useKeyboard } from "../../../shared/hooks/use-keyboard";

const LoginScreen = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const keyboard = useKeyboard();

  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
      const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");
      // if (jwtToken) {
      //   navigation.dispatch(StackActions.replace("App"));
      // }
    }
    // const unsubscribe = navigation.addListener("blur", async (e) => {
    //   setEmail("");
    //   setPassword("");
    //   loginApiResult.reset();
    // });

    prepare();
    // Unsubscribe to event listener when component unmount
    // return () => unsubscribe();
  }, []);

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
    // navigation.dispatch(StackActions.replace("App"));
  };

  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);

  const handleOnSubmit = async () => {
    if (email && password) {
      const res = await loginApi({ email, password });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", alignItems: "center" }}>
        <View style={styles.titleWrapper}>
          <Image
            style={styles.titleImage}
            source={require("../../../assets/images/title-dark.png")}
          />
        </View>
        <Text style={{ marginTop: 19, fontSize: 14 }}>
          Sign in, unleash your productivity!
        </Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => {
            setEmail(value);
          }}
          value={email}
          nativeID="email"
          placeholder="Enter your email..."
        />
      </View>
      <Button
          // containerStyle={{ width: 80, borderRadius: 8 }}
          title="Next"
        />

      {/* <View
        style={{
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: 25,
        }}
      >
        <Button type="clear" title="Create account" />
        <Button
          // containerStyle={{ width: 80, borderRadius: 8 }}
          title="Next"
        />
      </View> */}
    </View>
  );
};

{
  /* <TextInput
        style={{ ...styles.input, marginTop: 20, marginBottom: 40 }}
        onChangeText={(value) => {
          setPassword(value);
        }}
        value={password}
        nativeID="password"
        placeholder="Password"
        secureTextEntry={true}
      /> */
}
{
  /* <View style={{ height: 10 }}>
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
      </View> */
}
{
  /* <Button
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
      </Text> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 30
  },
  titleWrapper: {
    height: 48,
    width: 231,
    marginTop: 106,
  },
  titleImage: {
    flex: 1,
    height: null,
    resizeMode: "contain",
    width: null,
  },
  inputWrapper: {
    marginTop: 60,
    display: "flex",
    alignItems: "center",
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
