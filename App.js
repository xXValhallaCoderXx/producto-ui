import { Provider } from "react-redux";
import { Platform, KeyboardAvoidingView } from "react-native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useCallback, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-toast-notifications";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import store from "./src/shared/config/store";
import theme from "./src/shared/styles/theme";

import Toast from "./src/components/Toast";
import RootScreens from "./src/screens/RootScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        Platform.OS === "android" &&
          (await NavigationBar.setBackgroundColorAsync("white"));
        Platform.OS === "android" &&
          (await NavigationBar.setButtonStyleAsync("dark"));
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
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  const renderToast = (options) => <Toast toast={options} />;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <ToastProvider renderToast={renderToast}>
            <NavigationContainer>
              <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ flex: 1, backgroundColor: "white" }}
                >
                  <RootScreens />
                </KeyboardAvoidingView>
              </SafeAreaView>
            </NavigationContainer>
          </ToastProvider>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
