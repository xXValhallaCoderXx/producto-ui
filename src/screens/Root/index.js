import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import { toggleInit } from "../../shared/slice/global-slice";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
      const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");

      if (jwtToken) {
        navigation.dispatch(StackActions.replace("App"));
      }

      dispatch(toggleInit());
    }

    prepare();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Auth" component={AuthScreens} />
      <Stack.Screen name="App" component={AppScreens} />
    </Stack.Navigator>
  );
};

export default RootScreen;
