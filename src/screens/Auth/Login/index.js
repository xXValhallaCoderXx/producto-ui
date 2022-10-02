import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef, useEffect } from "react";
import { TextInput, Animated, ScrollView } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Text } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useWindowDimensions } from "react-native";
import { StackActions } from "@react-navigation/native";
import { StyleSheet, View, Image, ToastAndroid } from "react-native";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  useLoginMutation,
  useLazyVerifyEmailQuery,
} from "../../../api/auth-api";
import FooterActions from "./FooterAction";

const titleDark = require("../../../assets/images/title-dark.png");
const LoginScreen = ({ navigation }) => {
  const emailInputRef = useRef(null);
  const dispatch = useDispatch();
  const passwordInputRef = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordInputPos = useRef(new Animated.Value(windowWidth / 2)).current;
  const [loginApi, loginApiResult] = useLoginMutation();
  const [verifyTigger, verifyResult] = useLazyVerifyEmailQuery({
    email,
  });
  const [step, setStep] = useState(1);
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
      console.log("LOGIN SUCCESS")
      setTokenAndRedirect(loginApiResult.data);
    }
  }, [loginApiResult.isSuccess]);

  setTokenAndRedirect = async (token) => {
    const {accessToken, refreshToken} = token;

    await SecureStore.setItemAsync("producto-jwt-token", accessToken);
    await SecureStore.setItemAsync("producto-jwt-refresh-token", refreshToken);

    ToastAndroid.show("Login success", ToastAndroid.SHORT);
    dispatch(toggleIsAuthenticated({ isAuthenticated: true }));
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
          setTokenAndRedirect(res.data);
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
        } else if (res.error.status === 404) {
          setError("Email address not found");
        }
      }
    }
  };

  const handleOnPressSecondary = () => {
    setError("");
    if (step === 1) {
      navigation.navigate("Registration");
    } else {
      emailInputRef.current.focus();
      setStep(nextStep);
    }
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
          isLoading={verifyResult.isFetching || loginApiResult.isLoading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
