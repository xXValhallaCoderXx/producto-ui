import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Animated, Image } from "react-native";
import { useState, useEffect } from "react";
import TextComponent from "../../components/Text";
import LoginScreen from "./Login";
import RegistrationScreen from "./Register";
import splashIcon from "../../assets/images/splash-icon.png";

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [init, setInit] = useState(false);

  useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    fadeAnimation.start((result) => {
      if (result.finished) {
        setInit(true);
      }
    });
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
        <Image style={{ height: 100, width: 60 }} source={splashIcon} />
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
