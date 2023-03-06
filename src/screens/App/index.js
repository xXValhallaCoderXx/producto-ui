import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import { Animated } from "react-native";
import ProfileScreen from "./Profile";
import { TouchableNativeFeedback, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
const Tab = createBottomTabNavigator();

const buttonNativeFeedback = ({ children, style, ...props }) => (
  <TouchableNativeFeedback
    {...props}
    background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
  >
    <View style={style}>{children}</View>
  </TouchableNativeFeedback>
);

export default function App() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontWeight: "700",
        },
        tabBarStyle: {
          height: 75,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarButton: buttonNativeFeedback,
        tabBarIcon: ({ focused, color, size, ...rest }) => {
          let iconName;
          if (route.name === "Today") {
            iconName = "list";
          } else if (route.name === "Account") {
            return (
              <AnimatedIcon {...rest} name="person" size={size} color={color} />
            );
          }
          return (
            <Feather {...rest} name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Today" component={DashboardScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
