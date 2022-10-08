import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "./Profile";
import UpdatePassword from "./UpdateEmail";
import UpdateEmail from "./UpdateEmail";

const Stack = createNativeStackNavigator();

const ProfileScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        return {
          headerShown: route.name === "Accounts" ? false : true,
        };
      }}
    >
      <Stack.Screen name="Accounts" component={AccountScreen} />
      <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
    </Stack.Navigator>
  );
};

export default ProfileScreens;
