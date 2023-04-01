import ProductoButton from "../Button";
import { View, StyleSheet } from "react-native";

const AuthFooter = ({
  onPressPrimary,
  onPressSecondary,
  isLoading,
  primaryText,
  secondaryText,
  disablePrimary,
}) => {
  return (
    <View style={styles.container}>
      <ProductoButton
        onPress={onPressSecondary}
        title={secondaryText}
        type="text"
        contentStyle={{ paddingTop: 5, paddingBottom: 5 }}
        disabled={isLoading}
        size="md"
      />

      <ProductoButton
        onPress={onPressPrimary}
        type="contained"
        size="md"
        style={{ minWidth: 110 }}
        title={primaryText}
        disabled={isLoading || disablePrimary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default AuthFooter;
