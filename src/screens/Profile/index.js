import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "./Profile";
import UpdatePassword from "./UpdatePassword/UpdatePassword";
import UpdateEmail from "./UpdateEmail/UpdateEmail";
import { Timezone } from "./Timezone";

const Stack = createNativeStackNavigator();

const ProfileScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        return {
          contentStyle: { backgroundColor: "white" },
          headerShown: route.name === "Settings" ? false : true,
        };
      }}
    >
      <Stack.Screen name="Settings" component={AccountScreen} />
      <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
      <Stack.Screen name="UpdateTimezone" component={Timezone} />
    </Stack.Navigator>
  );
};

export default ProfileScreens;
