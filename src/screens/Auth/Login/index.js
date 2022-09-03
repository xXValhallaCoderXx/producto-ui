import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated, ScrollView } from "react-native";
import { Text } from "@rneui/themed";
import { useWindowDimensions } from "react-native";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import {
  useLoginMutation,
  useLazyVerifyEmailQuery,
} from "../../../api/auth-api";
import FooterActions from "./FooterAction";

const titleDark = require("../../../assets/images/title-dark.png");

const LoginScreen = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordInputPos = useRef(new Animated.Value(0)).current;

  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult, verifyInfo] = useLazyVerifyEmailQuery({
    email,
  });
  const [step, setStep] = useState(1);

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
    if (step === 1) {
      Animated.timing(passwordInputPos, {
        toValue: windowWidth / 2,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(passwordInputPos, {
        toValue: -(windowWidth / 2),
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


  const handleOnPressPrimary = async () => {
    const nextStep = step === 1 ? 2 : 1;
    setError("");
    if (nextStep === 1) {
      if (password === "") {
        setError("Please enter a password");
      } else {
        const res = await loginApi({ email, password });
        if (res.data) {
          setTokenAndRedirect(res.data.access_token);
        } else if (res.error.status === 400) {
          setError(res.error.data.message);
        }
      }
    } else {
      const res = await verifyTigger({ email });
      passwordInputRef.current.focus();
      if (res.isSuccess) {
        setStep(nextStep);
      } else {
        if (res.error.status === 200) {
          setStep(nextStep);
        } else if (res.error.status === 400) {
          setError(res.error.data.message[0]);
          // setError(res.error.data.message[0])
        } else if (res.error.status === 404) {
          setError("Email address not found");
        }
      }
    }
  };

  const handleOnPressSecondary = () => {
    const nextStep = step === 1 ? 2 : 1;
    setError("");
    if (nextStep === 1) {
      console.log("TO EMAIL");
      emailInputRef.current.focus();
      // if (email === "") {
      //   setError("Enter email address");
      // } else {
      //   setStep(nextStep);
      // }
    } else {
      console.log("TO PASSOWRD");
      passwordInputRef.current.focus();

      // if (password === "") {
      //   setError("Enter password");
      // } else {
      //   setStep(nextStep);
      // }
    }
    setStep(nextStep);
  };

  const handleOnChangeEmail = (value) => {
    setError("");
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setError("");
    setPassword(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={titleDark}
          resizeMode="contain"
          style={{
            width: 231,
            height: 42,
          }}
        ></Image>
        <View style={{ marginTop: 19 }}>
          <Text style={styles.secondaryTitle}>
            Sign in, to continue to Producto
          </Text>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            ...styles.inputWrapper,
            transform: [{ translateX: passwordInputPos }],
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  width: windowWidth * 0.85,
                  maxWidth: windowWidth * 0.9,
                }}
                ref={emailInputRef}
                onChangeText={handleOnChangeEmail}
                value={email}
                nativeID="email"
                placeholder="Enter your email..."
              />

              {error ? (
                <Text
                  style={{
                    marginTop: 10,
                    color: "#D14343",
                    alignSelf: "flex-start",
                    fontWeight: "700",
                    paddingLeft: windowWidth - windowWidth * 0.9,
                  }}
                >
                  {error}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  width: windowWidth * 0.85,
                  maxWidth: windowWidth * 0.9,
                }}
                ref={passwordInputRef}
                onChangeText={handleOnChangePassword}
                value={password}
                nativeID="password"
                placeholder="Enter your password..."
              />
              {error ? (
                <Text
                  style={{
                    marginTop: 10,
                    color: "#D14343",
                    alignSelf: "flex-start",
                    fontWeight: "700",
                    paddingLeft: windowWidth - windowWidth * 0.9,
                  }}
                >
                  {error}
                </Text>
              ) : null}
            </View>
          </View>
        </Animated.View>

        <FooterActions
          handleOnPressPrimary={handleOnPressPrimary}
          handleOnPressSecondary={handleOnPressSecondary}
          step={step}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 106,
  },
  secondaryTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginLeft: -10,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 80,
  },
  input: {
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default LoginScreen;
