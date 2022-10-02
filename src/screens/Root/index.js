import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "../../components";
import { useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import { useRoute } from "@react-navigation/native";
import { useGetProfileQuery } from "../../api/user-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  useGetProfileQuery({});
  const { isAuthenticated } = useSelector((state) => state.global);

  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
    }
    prepare();
  }, []);

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
