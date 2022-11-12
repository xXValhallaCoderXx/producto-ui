import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export const StatsCard = (props) => {
  const { numerator = 5, denominator = 1 } = props;
  const showProgressBar = denominator !== undefined;

  const [cardWidth, setCardWidth] = React.useState(0);

  const progressBarContainerStyles = [styles.progressBarContainer];

  if (showProgressBar) {
    progressBarContainerStyles.push({ backgroundColor: "blue" });
  }

  const progressBarWidthAnimated = useAnimatedStyle(() => {
    if (!showProgressBar) {
      return {
        width: 0,
      };
    }

    return {
      width: withSpring((numerator / denominator) * cardWidth),
    };
  }, [numerator, denominator, cardWidth]);

  const progressBarStyles = [styles.progressBar, progressBarWidthAnimated];

  if (numerator === denominator) {
    progressBarStyles.push({ borderBottomRightRadius: 0 });
  }

  return <Animated.View style={progressBarStyles} />;
};

const styles = StyleSheet.create({
  progressBarContainer: {
    backgroundColor: "transparent",
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    width: 0,
    backgroundColor: "red",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
