import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./Profile";
import UpdatePassword from "./UpdatePassword";
import UpdateEmail from "./UpdateEmail";
import UpdateTimezone from "./UpdateTimezone";

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
      <Stack.Screen name="Accounts" component={ProfileScreen} />
      {/* <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
      <Stack.Screen name="UpdateTimezone" component={UpdateTimezone} /> */}
    </Stack.Navigator>
  );
};

export default ProfileScreens;
