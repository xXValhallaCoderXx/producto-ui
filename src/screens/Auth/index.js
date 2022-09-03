import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Login";
import { View } from "react-native";
import RegistrationScreen from "./Register";
import { useSelector } from "react-redux";
const Stack = createNativeStackNavigator();

const AuthScreens = ({ navigation, route }) => {
    const isInit = useSelector(state => state.global)
    console.log("ROPTE: ", isInit)

    // if(!route.params.init){
    //     return <View  style={{flex: 1}} />
    // }
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );
};

export default AuthScreens;
