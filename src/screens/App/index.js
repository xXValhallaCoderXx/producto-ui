import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import ProfileScreen from "./Profile";
import GoalScreen from "./Goals";
import { Button, Text } from "@rneui/themed";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

const Tab = createBottomTabNavigator();

export default function App() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
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
    >
      <Tab.Screen name="Today" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
