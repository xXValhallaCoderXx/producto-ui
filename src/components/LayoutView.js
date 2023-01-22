import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const LayoutView = ({ children, customStyle }) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingBottom: Platform.OS === "ios" ? 250 : 0,
    // paddingTop: Platform.OS === "ios" ? 15 : 5,
  },
});

export default LayoutView;
