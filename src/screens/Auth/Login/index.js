import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated, ScrollView } from "react-native";
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
  const passwordInputPos = useRef(new Animated.Value(0)).current;
  const titlePosition = useRef(new Animated.Value(0)).current;
  const inputPosition = useRef(new Animated.Value(0)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const [step, setStep] = useState(1);
  const keyboard = useKeyboard();
  console.log("KEYBOARD: ", keyboard);
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
    if (keyboard.keyboardShown) {
      Animated.timing(titlePosition, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(inputPosition, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(titlePosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(inputPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboard.keyboardShown]);

  useEffect(() => {
    if (step === 1) {
      Animated.timing(passwordInputPos, {
        toValue: 250,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(passwordInputPos, {
        toValue: -250,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [step]);

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

  const handleOnSubmit = async () => {
    if (email && password) {
      const res = await loginApi({ email, password });
    }
  };

  const handleOnPressNext = () => {
    const nextStep = step === 1 ? 2 : 1;
    setStep(nextStep);
  };

  const handleOnPressSecondary = () => {
    const nextStep = step === 1 ? 2 : 1;
    setStep(nextStep);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 106,
          transform: [{ translateY: titlePosition }],
        }}
      >
        <Image
          source={require("../../../assets/images/title-dark.png")}
          resizeMode="contain"
          style={{
            width: 231,
            height: 42,
          }}
        ></Image>
        <View style={{ marginTop: 19 }}>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.secondary,
              textAlign: "center",
              marginLeft: -10,
            }}
          >
            Sign in, to continue to Producto
          </Text>
        </View>
      </Animated.View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ justifyContent: "space-around", flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              ...styles.inputWrapper,
              transform: [{ translateY: inputPosition }],
            }}
          >
            <Animated.View
              style={{
                display: "flex",
                flexDirection: "row",
                transform: [{ translateX: passwordInputPos }],
              }}
            >
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                value={email}
                nativeID="email"
                placeholder="Enter your email..."
              />

              <TextInput
                autoFocus={true}
                style={styles.input}
                onChangeText={(value) => {
                  setPassword(value);
                }}
                value={password}
                nativeID="password"
                placeholder="Enter your password..."
              />
            </Animated.View>
          </Animated.View>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexDirection: "row",
              padding: 25,
            }}
          >
            <Button
              onPress={handleOnPressSecondary}
              type="clear"
              title={step === 1 ? "Create Account" : "Change Email"}
            />
            <Button
              onPress={handleOnPressNext}
              containerStyle={{ width: 80, borderRadius: 8 }}
              title={step === 1 ? "Next" : "Log in"}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 80,
  },
  input: {
    width: 300,
    height: 45,
    marginLeft: 100,
    marginRight: 100,
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
