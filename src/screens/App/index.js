import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "./Today";
import { Animated, Easing } from "react-native";
import ProfileScreen from "./Profile";
import { TouchableNativeFeedback, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import LayoutView from "../../components/LayoutView";
import { useEffect, useRef } from "react";
import { Text } from "react-native-paper";

const Tab = createBottomTabNavigator();

const buttonNativeFeedback = ({ children, style, ...props }) => {
  const { theme } = useTheme();
  const { item, accessibilityState } = props;

  const focused = accessibilityState.selected;
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 0.8];
  const scale = animation.interpolate({ inputRange, outputRange });

  const iconName = props.to === "/Root/App/Account" ? "Account" : "Today";

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(animation, {
          toValue: 1.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(animation, {
          toValue: -1.0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // return to begin position
        Animated.timing(animation, {
          toValue: 0.0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const handleOnPress = () => {};

  return (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
    >
      <View style={style}>
        <Animated.View style={[{ transform: [{ scale }] }]}>
          {iconName === "Today" ? (
            <Ionicons
              name={"home-sharp"}
              size={25}
              color={focused ? theme.colors.primary : theme.colors.secondary}
            />
          ) : (
            <Ionicons
              name="person"
              size={25}
              color={focused ? theme.colors.primary : theme.colors.secondary}
            />
          )}
        </Animated.View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 2,
            color: focused ? theme.colors.primary : theme.colors.secondary,
          }}
        >
          {iconName === "Today" ? "Home" : "Account"}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default function App() {
  const { theme } = useTheme();
  return (
    <LayoutView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
          },
          tabBarButton: buttonNativeFeedback,
          // tabBarIcon: ({ focused, color, size, ...rest }) => {
          //   let iconName;
          //   if (route.name === "Today") {
          //     iconName = "list";
          //   } else if (route.name === "Account") {
          //     return (
          //       <Ionicons name="person" size={20} color={color} />
          //     );
          //   }
          //   return (
          //     <Feather name={iconName} size={size} color={color} />
          //   );
          // },
        })}
      >
        <Tab.Screen name="Today" component={DashboardScreen} />
        <Tab.Screen name="Account" component={ProfileScreen} />
      </Tab.Navigator>
    </LayoutView>
  );
}
