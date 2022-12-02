import { TouchableWithoutFeedback, Keyboard } from "react-native";

const KeyboarDismissView = ({ children }) => {
  const handleOnPress = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={handleOnPress}
      accessible={false}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default KeyboarDismissView;