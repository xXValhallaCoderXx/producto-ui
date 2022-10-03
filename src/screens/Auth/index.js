import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import LoginScreen from "./Login";
import RegistrationScreen from "./Register";
import { toggleFirstLoad } from "../../shared/slice/global-slice";

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleFirstLoad(true));
  }, [])
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );
};

export default AuthScreens;
