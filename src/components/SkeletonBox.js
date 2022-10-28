import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const SkeletonBox = ({ width = 100, height = 40 }) => {
  const translateAnim = useRef(new Animated.Value(0)).current;

  const circleAnimated = () => {
    translateAnim.setValue(0);
    Animated.timing(translateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        circleAnimated();
      }, 1000);
    });
  };

  const translateX3 = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 350],
  });

  useEffect(() => {
    circleAnimated();
  }, []);
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: "#ECEFF1",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          width: "20%",
          height: "100%",
          backgroundColor: "white",
          opacity: 0.5,
          transform: [{ translateX: translateX3 }],
        }}
      ></Animated.View>
    </View>
  );
};

export default SkeletonBox;
