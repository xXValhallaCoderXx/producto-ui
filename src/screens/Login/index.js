import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text } from "@rneui/themed";
import {
  StyleSheet,
  // Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LoginSection from "./LoginSection";
import RegisterSection from "./RegisterSection";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import Button from "../../components/Button";

const LoginScreen = () => {
  const [displayForm, setDisplayForm] = useState(false);
  const [formType, setFormType] = useState("login");
  // const offset = useSharedValue(0);
  const titleOffset = useSharedValue(0);
  const imageOffset = useSharedValue(0);
  const ctaWrapperOffset = useSharedValue(0);
  const loginFormOffset = useSharedValue(280);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: titleOffset.value }],
    };
  });

  // const imageAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: imageOffset.value }],
  //   };
  // });
  const ctaWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: ctaWrapperOffset.value }],
    };
  });

  const loginFormStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: loginFormOffset.value }],
    };
  });

  const onClickToggleForm = (formType) => () => {
    if (!displayForm) {
      titleOffset.value = withSpring(20);
      loginFormOffset.value = withSpring(-130);
      imageOffset.value = withDelay(0, withSpring(-0));
      ctaWrapperOffset.value = withSpring(550);
    } else {
      titleOffset.value = withSpring(0);
      imageOffset.value = withDelay(0, withSpring(0));
      loginFormOffset.value = withSpring(300);
      ctaWrapperOffset.value = withSpring(0);
    }
    setFormType(formType);
    setDisplayForm(!displayForm);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.titleWrapper, titleAnimatedStyle]}>
        <Text style={{ color: "#00a8e8" }} h1>
          Producto
        </Text>
        <Text style={{ color: "#007ea7" }} h4>
          Unleash Your Creativity
        </Text>
      </Animated.View>
      {/* <Animated.View style={[styles.imageWrapper, imageAnimatedStyle]}>
        <Image
          style={styles.imageStyle}
          source={require("../../assets/sad-one.png")}
        />
      </Animated.View> */}
      <Animated.View style={[styles.ctaWrapper, ctaWrapperStyle]}>
        <Button
          color="#007ea7"
          title="Login"
          onPress={onClickToggleForm("login")}
        />
        <Button
          type="clear"
          color="#007ea7"
          title="Signup"
          onPress={onClickToggleForm("register")}
        />
      </Animated.View>
      <Animated.View style={[styles.loginWrapper, loginFormStyle]}>
        {formType === "login" ? (
          <LoginSection onClickDismissLogin={onClickToggleForm("login")} />
        ) : null}
        {formType === "register" ? (
          <RegisterSection onClickDismiss={onClickToggleForm("register")} />
        ) : null}
      </Animated.View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003459",
    display: "flex",
    justifyContent: "space-between",
  },
  titleWrapper: {
    marginTop: 130,
    display: "flex",
    alignItems: "center",
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  loginWrapper: {},
  ctaWrapper: {},
  imageStyle: {
    height: 300,
    width: 300,
  },
});

export default LoginScreen;
