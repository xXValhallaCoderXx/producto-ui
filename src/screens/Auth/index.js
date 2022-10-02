import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Animated, Image } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoginScreen from "./Login";
import RegistrationScreen from "./Register";
import splashIcon from "../../assets/images/splash-icon.png";

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
  const init = useSelector(state => state.global.init);
  console.log("X", init);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [imageScaleAnim] = useState(new Animated.Value(4.5));

  useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const scaleAnimation = Animated.timing(imageScaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    fadeAnimation.start();
    scaleAnimation.start();
  }, []);

  if (!init) {
    return (
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          opacity: fadeAnim,
        }}
      >
        <Animated.View style={{ transform: [{ scale: imageScaleAnim }] }}>
          <Image
            resizeMode="contain"
            style={{ height: 100 }}
            source={splashIcon}
          />
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={{
        flex: 1,

        opacity: fadeAnim,
      }}
    >
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </Animated.View>
  );
};

export default AuthScreens;
