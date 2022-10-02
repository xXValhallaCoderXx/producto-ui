import { Animated, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import splashIcon from "../../assets/images/splash-icon.png";
import {
  toggleInit,
  toggleIsAuthenticated,
} from "../../shared/slice/global-slice";
import { useLazyRefreshTokenQuery } from "../../api/auth-api";
// import { useRoute } from "@react-navigation/native";
import { useGetProfileQuery } from "../../api/user-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  useGetProfileQuery()
  // const [refreshApi, refreshApiResult] = useLazyRefreshTokenQuery();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnim2] = useState(new Animated.Value(0));
  const [imageScaleAnim] = useState(new Animated.Value(4.5));
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
    scaleAnimation.start((result) => {
      if (result.finished) {
        fadeAnimation2.start();
        dispatch(toggleInit(true));
      }
    });
    prepare();
    // handleInitialAuth();
  }, []);

  // const handleInitialAuth = async () => {
  //   const refreshToken = await SecureStore.getItemAsync(
  //     "producto-jwt-refresh-token"
  //   );
  //   if (!refreshToken) {
  //     dispatch(toggleIsAuthenticated(false));
  //   } else {
  //     console.log("WE HAVE A REFRESH TOKEN LETS CALL API");
  //     await refreshApi({ refreshToken });
  //   }
  // };

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
        opacity: fadeAnim2,
      }}
    >
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppScreens} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreens} />
        )}
      </Stack.Navigator>
    </Animated.View>
  );
};

export default RootScreen;
