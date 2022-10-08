import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import { useRef } from "react";
import { Animated } from "react-native";
import ProfileScreen from "./Profile";
import { TouchableNativeFeedback, View, Easing, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import LayoutView from "../../components/LayoutView";
// import { useGetProfileQuery } from "../../api/user-api";

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
  const squish = useRef(new Animated.Value(20)).current;

  const handleOnClick = () => {
    Animated.timing(squish, {
      toValue: 25,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce
    }).start();
  }
  console.log("QUSHGN : ", squish);
  return (
    <LayoutView>
      <Tab.Navigator
        
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 65,
            paddingTop: 10,
            paddingBottom: 10,
          },
          tabBarButton: buttonNativeFeedback,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Today") {
              iconName = "list";
            } else if (route.name === "Account") {
              return <Ionicons onPress={handleOnClick} name="person" size={20} color={color} />;
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Today" component={DashboardScreen} />
        <Tab.Screen name="Account" component={ProfileScreen} />
      </Tab.Navigator>
    </LayoutView>
  );
}
