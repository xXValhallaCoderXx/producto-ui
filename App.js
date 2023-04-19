import * as Sentry from "sentry-expo";
import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootScreens from "./src/screens/Root";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import store from "./src/config/store";
import { Provider as PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";
import * as SplashScreen from "expo-splash-screen";
import theme from "./src/shared/styles/theme";
import Toast from "./src/components/Toast";

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://d6daab397b164138946fc445afb30f8b@o4505036216074240.ingest.sentry.io/4505036217647104",
  enableInExpoDevelopment: true,
  debug: true,
});

const Stack = createNativeStackNavigator();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        Platform.OS === "android" &&
          (await NavigationBar.setBackgroundColorAsync("white"));
        Platform.OS === "android" &&
          (await NavigationBar.setButtonStyleAsync("dark"));

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
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <ToastProvider
            duration={2500}
            animationType="zoom-in"
            offset={30}
            placement="bottom"
            renderToast={(toastOptions) => <Toast toast={toastOptions} />}
          >
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <Stack.Navigator
                  screenOptions={() => ({
                    headerShown: false,
                  })}
                >
                  <Stack.Screen name="Root" component={RootScreens} />
                </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </ToastProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Sentry.Native.wrap(App);
