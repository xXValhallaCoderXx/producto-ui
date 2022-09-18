import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "../../components";
import { useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import { useGetProfileQuery } from "../../api/user-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  useGetProfileQuery({});
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
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text type="h2">Loading...</Text>
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
