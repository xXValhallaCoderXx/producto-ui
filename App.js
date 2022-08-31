import { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider, createTheme } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/Auth/Login";
import RegistrationScreen from "./src/screens/Auth/Register";
import AppScreens from "./src/screens/App";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./src/config/store";
import { Image, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient({});
const Stack = createNativeStackNavigator();

const theme = createTheme({
  lightColors: {
    primary: "#5048E5",
  },
  darkColors: {
    primary: "#5048E5",
  },
  components: {
    Button: {
      titleStyle: {
        color: "red",
      },
    },
  },
});

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [skipInit, setSkipInit] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await NavigationBar.setBackgroundColorAsync("white");
    await NavigationBar.setButtonStyleAsync("dark");

    // const appInit = await AsyncStorage.getItem("@producto-app-initalized");
    // if (appInit) {
    //   console.log("WOOOHOOO");
    // } else {
    //   await AsyncStorage.setItem("@producto-app-initalized", "true");
    // }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2500,
      useNativeDriver: true,
    }).start(({ finished }) => {
      setIsLoaded(true);
    });
  }, [fadeAnim]);

  if (!isLoaded) {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "cener",
          },
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Image
          style={{ height: 60, width: 60 }}
          source={require("./src/assets/images/splash-icon.png")}
        />
      </Animated.View>
    );
  }
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusBar style="dark" backgroundColor="white" />
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={({ route }) => ({
                  headerShown: false,
                })}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                  name="Registration"
                  component={RegistrationScreen}
                />
                <Stack.Screen name="App" component={AppScreens} />
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
