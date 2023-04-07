import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./Login";
import RegistrationScreen from "./Register";
import ForgotPasswordScreen from "./ForgotPassword";
import EnterNewPasswordScreen from "./EnterNewPassword";

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EnterPassword" component={EnterNewPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthScreens;
