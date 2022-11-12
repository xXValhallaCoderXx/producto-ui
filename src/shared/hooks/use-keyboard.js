import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export function useKeyboard() {
  const [shown, setShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // const _keyboardDidShow = (e) => {
  //   setShown(true);
  // };
  // const _keyboardDidHide = (e) => {
  //   setShown(false);
  //   setKeyboardHeight(0);
  // };

  const _keyboardWillHide = (e) => {
    setShown(false);
    setKeyboardHeight(0);
  };

  const _keyboardWillShow = (e) => {
    setShown(true);
    setKeyboardHeight(e.endCoordinates.height);
  };

  useEffect(() => {
    // const didShowSub = Keyboard.addListener(
    //   "keyboardDidShow",
    //   _keyboardDidShow
    // );
    // const didHideSub = Keyboard.addListener(
    //   "keyboardDidHide",
    //   _keyboardDidHide
    // );
    const willHideSub = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardWillHide
    );
    const willShowSub = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardWillShow
    );

    // cleanup function
    return () => {
      // didHideSub.remove();
      // didShowSub.remove();
      willHideSub.remove();
      willShowSub.remove();
    };
  }, []);

  return {
    keyboardShown: shown,
    keyboardHeight,
  };
}
