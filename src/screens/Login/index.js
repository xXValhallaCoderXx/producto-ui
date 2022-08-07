import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text } from "@rneui/themed";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LoginSection from "./LogoSection";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import Button from "../../components/Button";

const LoginScreen = () => {
  const [displaySignup, setDisplaySignup] = useState(false);
  const offset = useSharedValue(0);
  const titleOffset = useSharedValue(0);
  const imageOffset = useSharedValue(0);
  const ctaWrapperOffset = useSharedValue(0);
  const loginFormOffset = useSharedValue(280);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: titleOffset.value }],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: imageOffset.value }],
    };
  });
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

  const onClickSignup = () => {
    if (!displaySignup) {
      titleOffset.value = withSpring(-150);
      loginFormOffset.value = withSpring(-130);
      imageOffset.value = withDelay(100, withSpring(-100));
      ctaWrapperOffset.value = withSpring(400);
    } else {
      titleOffset.value = withSpring(0);
      imageOffset.value = withDelay(50, withSpring(0));
      loginFormOffset.value = withSpring(220);
      ctaWrapperOffset.value = withSpring(0);
    }
    setDisplaySignup(!displaySignup);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.titleWrapper, titleAnimatedStyle]}>
        <Text style={{color: "#00a8e8"}} h1>Expenso-Track!</Text>
        <Text style={{color: "#007ea7"}} h4>We magically track your expenses</Text>
      </Animated.View>
      <Animated.View style={[styles.imageWrapper, imageAnimatedStyle]}>
        <Image
          style={styles.imageStyle}
          source={require("../../assets/sad-one.png")}
        />
      </Animated.View>
      <Animated.View style={[styles.ctaWrapper, ctaWrapperStyle]}>
        <Button color="#007ea7" title="Login" onPress={onClickSignup} />
        <Button type="clear" color="#007ea7" title="Signup" onPress={onClickSignup} />
      </Animated.View>
      <Animated.View style={[styles.loginWrapper, loginFormStyle]}>
        <LoginSection onClickDismissLogin={onClickSignup} />
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
