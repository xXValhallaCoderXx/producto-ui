
import { TouchableNativeFeedback, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, useTheme } from "react-native-paper";

const BottomNavBar = ({ children, style, ...props }) => {
  const theme = useTheme();
  const { item, accessibilityState } = props;

  const focused = accessibilityState.selected;
  // const animation = new Animated.Value(0);
  // const inputRange = [0, 1];
  // const outputRange = [1, 0.8];
  // const scale = animation.interpolate({ inputRange, outputRange });

  const iconName = props.to === "/Profile" ? "Profile" : "Home";
  
  // useEffect(() => {
  //   if (focused) {
  //     Animated.sequence([
  //       // start rotation in one direction (only half the time is needed)
  //       Animated.timing(animation, {
  //         toValue: 1.0,
  //         duration: 150,
  //         easing: Easing.linear,
  //         useNativeDriver: true,
  //       }),
  //       // rotate in other direction, to minimum value (= twice the duration of above)
  //       Animated.timing(animation, {
  //         toValue: -1.0,
  //         duration: 300,
  //         easing: Easing.linear,
  //         useNativeDriver: true,
  //       }),
  //       // return to begin position
  //       Animated.timing(animation, {
  //         toValue: 0.0,
  //         duration: 150,
  //         easing: Easing.linear,
  //         useNativeDriver: true,
  //       }),
  //     ]).start();
  //   }
  // }, [focused]);

  return (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
    >
      <View style={style}>
        <View>
          {iconName === "Home" ? (
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
        </View>
        <Text
          style={{
            fontSize: 16,
            marginTop: 2,
            color: focused ? theme?.colors?.primary : theme?.colors?.secondary,
          }}
        >
          {iconName === "Home" ? "Home" : "Profile"}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

export default BottomNavBar;
