import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreens from "../Auth";
import AppScreens from "../App";
import { toggleInit } from "../../shared/slice/global-slice";
import { useUserProfileQuery } from "../../api/auth-api";

const Stack = createNativeStackNavigator();

const RootScreen = ({ navigation }) => {
  const [init, setInit] = useState(false);
  const dispatch = useDispatch();
  const { data, isError, isLoading, isSuccess, error, isUninitialized } =
    useUserProfileQuery({});
  const { isAuthenticated } = useSelector((state) => state.global);


  useEffect(() => {
    async function prepare() {
      await NavigationBar.setBackgroundColorAsync("white");
      await NavigationBar.setButtonStyleAsync("dark");
      // const jwtToken = await AsyncStorage.getItem("@producto-jwt-token");

      // if (jwtToken) {
      //   navigation.dispatch(StackActions.replace("App"));
      // }

      // dispatch(toggleInit());
    }

    prepare();
  }, []);

  // if(isLoading){
  //   return (
  //     <View>
  //       <Text>Hello</Text>
  //     </View>
  //   )
  // }


  console.log("IS LOADING: ", isLoading)


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
