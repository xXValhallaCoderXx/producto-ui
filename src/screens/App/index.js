import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import ProfileScreen from "./Profile";
import { TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
// import { useGetProfileQuery } from "../../api/user-api";

const Tab = createBottomTabNavigator();

export default function App({ navigation, route }) {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          // padding: 20,
          paddingTop: 10,
          paddingBottom: 8,
        },
        // tabBarStyle: { height: 50, margin: 10},
        tabBarButton: (props) => {
          return (
            <TouchableOpacity {...props}>{props.children}</TouchableOpacity>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Today") {
            iconName = "list";
          } else if (route.name === "Account") {
            return <Ionicons name="person" size={size} color={color} />;
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Today" component={DashboardScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
