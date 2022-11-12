import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  Platform,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useKeyboard } from "@react-native-community/hooks";
import { useRef } from "react";

const KeyboardShiftView = (props) => {
  const { children } = props;
  const [shift] = useState(new Animated.Value(0));
  const keyboard = useKeyboard();

  useEffect(() => {
    const didShowSub = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardDidShow
    );
    const didHideSub = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      didHideSub.remove();
      didShowSub.remove();
    };
  }, []);

  const handleKeyboardDidShow = () => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = keyboard.keyboardHeight;
    // const currentlyFocusedInputRef = TextInput.State.currentlyFocusedInput();
    // currentlyFocusedInputRef.measure((x, y, width, height, pageX, pageY) => {

    // });
    // const fieldHeight = height;
    // const fieldTop = pageY;
    // const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
    const gap = 500;
    // console.log("GAP: ", fieldTop);
    if (gap >= 0) {
      return;
    }
    console.log("sss");
    Animated.timing(shift, {
      toValue: gap,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleKeyboardDidHide = () => {
    Animated.timing(shift, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Android: we need an animated view since the keyboard style can vary widely
  // And React Native's KeyboardAvoidingView isn't always reliable
  console.log("SHIFT: ", shift);
  if (Platform.OS === "android") {
    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY: shift }] }]}
      >
        {children}
      </Animated.View>
    );
  }

  // iOS: React Native's KeyboardAvoidingView with header offset and
  // behavior 'padding' works fine on all ios devices (and keyboard types)
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      style={styles.container}
      behavior={"padding"}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KeyboardShiftView;
