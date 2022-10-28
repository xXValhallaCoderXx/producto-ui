import {
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const LayoutView = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: Platform.OS === "ios" ? 40 : 0,
    paddingTop: Platform.OS === "ios" ? 15 : 5,
  },
});

export default LayoutView;
