import { useState, useCallback, useEffect } from "react";
import { Platform, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { ThemeProvider } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootScreens from "./src/screens/Root";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./src/config/store";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import theme from "./src/shared/styles/theme";
import Toast from "./src/components/Toast";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({});
const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        Platform.OS === "android" &&
          (await NavigationBar.setBackgroundColorAsync("white"));
        Platform.OS === "android" &&
          (await NavigationBar.setButtonStyleAsync("dark"));

        const isFirstLoad = await AsyncStorage.getItem("@first-load");
        if (isFirstLoad === "true") {
          store.dispatch({
            type: "global/toggleFirstLoad",
            payload: true,
          });
        }

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

  const theme2 = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#5048E5",
      secondary: "#6B7280",
    },
  };

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Provider store={store}>
        <ToastProvider
          renderToast={(toastOptions) => <Toast toast={toastOptions} />}
        >
          <PaperProvider theme={theme2}>
            <ThemeProvider theme={theme}>
              <StatusBar style="dark" backgroundColor="white" />
              <QueryClientProvider client={queryClient}>
                <NavigationContainer>
                  <Stack.Navigator
                    screenOptions={() => ({
                      headerShown: false,
                    })}
                  >
                    <Stack.Screen name="Root" component={RootScreens} />
                  </Stack.Navigator>
                </NavigationContainer>
              </QueryClientProvider>
            </ThemeProvider>
          </PaperProvider>
        </ToastProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
