import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

// const emptyCoordinates = Object.freeze({
//   screenX: 0,
//   screenY: 0,
//   width: 0,
//   height: 0,
// });
// const initialValue = {
//   start: emptyCoordinates,
//   end: emptyCoordinates,
// };

export function useKeyboard() {
  const [shown, setShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // function onKeyboardWillShow(e) {
  //   // Remove type here if not using TypeScript
  //   setKeyboardHeight(e.endCoordinates.height);
  // }

  // function onKeyboarWillHide() {
  //   setKeyboardHeight(0);
  // }

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener(
  //     "keyboardWillShow",
  //     onKeyboardWillShow
  //   );
  //   const hideSubscription = Keyboard.addListener(
  //     "keyboardWillHide",
  //     onKeyboarWillHide
  //   );
  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  // const handleKeyboardWillShow = (e) => {
  //   console.log("WWWWW")
    // setShown(true);
    // setKeyboardHeight(e.endCoordinates.height);
  // };

  // const handleKeyboardWillHide = (e) => {
    // setShown(false);
    // setKeyboardHeight(0);
  // };

  // useEffect(() => {
  //   const subscriptions = [
  //     Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow),
  //     Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide),
  //   ];

  //   return () => {
  //     subscriptions.forEach((subscription) => subscription.remove());
  //   };
  // }, []);
  const _keyboardDidShow = (e) => {
    console.log("DID SHOW")
    setShown(true);
    setKeyboardHeight(e.endCoordinates.height);
  };
  const _keyboardDidHide = (e) => {
    console.log("DID HIDE")
    setShown(false);
    setKeyboardHeight(0);
  };

  const _keyboardWillHide = (e) => {
    console.log("WHAT IS: ", e.endCoordinates.height)
  };
  


  useEffect(() => {
    const didShowSub =  Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    const didHideSub = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    const willHideSub = Keyboard.addListener('keyboardWillHide', _keyboardWillHide);

    // cleanup function
    return () => {
      // Keyboard.remove('keyboardDidShow', _keyboardDidShow);
      // Keyboard.remove('keyboardDidHide', _keyboardDidHide);
      didHideSub.remove();
      didShowSub.remove();
      willHideSub.remove();
    };
  }, []);

  return {
    keyboardShown: shown,
    keyboardHeight
  };
}
