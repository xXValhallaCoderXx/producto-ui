import { TouchableWithoutFeedback, Keyboard } from "react-native";

const LayoutView = ({ children }) => {
  const handleOnPress = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={handleOnPress} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default LayoutView;
