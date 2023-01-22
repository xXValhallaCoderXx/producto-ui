import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import { Animated } from "react-native";
import ProfileScreen from "./Profile";
import {
  TouchableNativeFeedback,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

const { width, height } = Dimensions.get("window");
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
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      style={{
        width,
        height,
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 85,
            paddingTop: 10,
            paddingBottom: 30,
          },
          tabBarButton: buttonNativeFeedback,
          tabBarIcon: ({ focused, color, size, ...rest }) => {
            let iconName;
            if (route.name === "Today") {
              iconName = "list";
            } else if (route.name === "Account") {
              return (
                <AnimatedIcon
                  {...rest}
                  name="person"
                  size={size}
                  color={color}
                />
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
    </KeyboardAvoidingView>
  );
}
