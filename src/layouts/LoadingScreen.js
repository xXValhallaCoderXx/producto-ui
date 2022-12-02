import { Animated, Image } from "react-native";
import { useState, useEffect } from "react";
import splashIcon from "../../assets/splash-icon.png";

const LoadingScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnim2] = useState(new Animated.Value(0));
  const [imageScaleAnim] = useState(new Animated.Value(4.5));

  useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const fadeAnimation2 = Animated.timing(fadeAnim2, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const scaleAnimation = Animated.timing(imageScaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });
    fadeAnimation.start();
    scaleAnimation.start();
    fadeAnimation2.start();
  }, []);
  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        opacity: fadeAnim,
      }}
    >
      <Animated.View style={{ transform: [{ scale: imageScaleAnim }] }}>
        <Image
          resizeMode="contain"
          style={{ height: 100 }}
          source={splashIcon}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default LoadingScreen;
