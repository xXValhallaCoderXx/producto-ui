import { Animated, Easing } from "react-native";
import { TouchableNativeFeedback, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, useTheme } from "react-native-paper";


const BottomNavIcon = ({ children, style, ...props }) => {
  const theme = useTheme();
  const { item, accessibilityState } = props;

  const focused = accessibilityState.selected;
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 0.8];
  const scale = animation.interpolate({ inputRange, outputRange });

  const iconName = props.to === "/home" ? "home" : "profile";

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

  return (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
    >
      <View style={style}>
        <Animated.View style={[{ transform: [{ scale }] }]}>
          {iconName === "home" ? (
            <Ionicons
              name={"home-sharp"}
              size={25}
              color={
                focused ? theme?.colors?.primary : theme?.colors?.secondary
              }
            />
          ) : (
            <Ionicons
              name="person"
              size={25}
              color={focused ? theme?.colors?.primary : theme.colors?.secondary}
            />
          )}
        </Animated.View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 2,
            color: focused ? theme?.colors?.primary : theme?.colors?.secondary,
          }}
        >
          {iconName === "home" ? "Home" : "Account"}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};


export default BottomNavIcon