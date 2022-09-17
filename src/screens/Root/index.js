import { useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import { useUserProfileQuery } from "../../api/auth-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  const { data } = useUserProfileQuery({});
  const { isAuthenticated, init } = useSelector((state) => state.global);

  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
    }
    prepare();
  }, []);

  if (!init) {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppScreens} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreens} />
      )}
    </Stack.Navigator>
  );
};

export default RootScreen;
