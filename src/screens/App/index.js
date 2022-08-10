import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import ProfileScreen from "./Profile";
import { Button, Text } from "@rneui/themed";
import { Ionicons, Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Today") {
            iconName = "list";
          } else if (route.name === "Goals") {
            iconName = "target";
          } else if (route.name === "Account") {
            return <Ionicons name="person" size={size} color={color} />;
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#6F0DB3",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Today" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={ProfileScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
