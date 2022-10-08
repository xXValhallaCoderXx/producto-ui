import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "./Profile";
import EditItem from "./EditItem";

const Stack = createNativeStackNavigator();

const ProfileScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        return {
          headerStyle: {
            backgroundColor: "red",
          },
          headerShown: route.name === "Accounts" ? false : true,
        };
      }}
    >
      <Stack.Screen name="Accounts" component={AccountScreen} />
      <Stack.Screen name="EditAccount" component={EditItem} />
    </Stack.Navigator>
  );
};

export default ProfileScreens;
