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

  const handleKeyboardWillShow = (e) => {
    setShown(true);
  };

  const handleKeyboardWillHide = (e) => {
    setShown(false);
  };

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow),
      Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);
  return {
    keyboardShown: shown,
  };
}
