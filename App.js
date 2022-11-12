import { Provider } from "react-redux";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useState, useCallback, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "react-native-toast-notifications";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import RegisterScreen from "./src/screens/Auth/Register";
import store from "./src/config/store";
import theme from "./src/shared/styles/theme";

import Toast from "./src/components/Toast";
import { StatusBar } from "expo-status-bar";
import RootScreens from "./src/screens/Root";

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

  console.log("APP READY: ", appIsReady);
  console.log("FONT LOADIED:", fontsLoaded);
  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  const renderToast = (options) => <Toast toast={options} />;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Provider store={store}>
        <ToastProvider renderToast={renderToast}>
          <PaperProvider theme={theme}>
            <SafeAreaView style={{ flex: 1 }}>
        
                <NavigationContainer>
                  {/* <StatusBar style="white" backgroundColor="white" /> */}
                  <Stack.Navigator
                    screenOptions={() => ({
                      headerShown: false,
                    })}
                  >
                    <Stack.Screen name="Root" component={RootScreens} />
                  </Stack.Navigator>
                </NavigationContainer>
 
            </SafeAreaView>
          </PaperProvider>
        </ToastProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
