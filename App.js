import { useState, useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider, createTheme } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/Auth/Login";
import RegistrationScreen from "./src/screens/Auth/Register";
import AppScreens from "./src/screens/App";
import RootScreens from "./src/screens/Root";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./src/config/store";
import { Image, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({});
const Stack = createNativeStackNavigator();

const theme = createTheme({
  lightColors: {
    primary: "#5048E5",
    secondary: "#687280",
  },
  darkColors: {
    primary: "#5048E5",
    secondary: "#687280",
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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await NavigationBar.setBackgroundColorAsync("white");
        await NavigationBar.setButtonStyleAsync("dark");

        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
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
                <Stack.Screen name="Root" component={RootScreens} />
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
