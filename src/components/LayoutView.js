import { View, StyleSheet, Platform } from "react-native";

const LayoutView = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
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
