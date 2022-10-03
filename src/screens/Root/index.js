import { Animated, Image } from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import splashIcon from "../../assets/images/splash-icon.png";
import { useGetProfileQuery } from "../../api/user-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  useGetProfileQuery();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnim2] = useState(new Animated.Value(0));
  const [imageScaleAnim] = useState(new Animated.Value(4.5));
  const [animatedEnded, setAnimatedEnded] = useState(false);
  const { isAuthenticated, init } = useSelector((state) => state.global);

  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
    }

    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const fadeAnimation2 = Animated.timing(fadeAnim2, {
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
    fadeAnimation2.start();
    prepare();
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


  return (init && isAuthenticated) ? (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="App" component={AppScreens} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Auth" component={AuthScreens} />
    </Stack.Navigator>
  );
};

export default RootScreen;
