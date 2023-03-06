import ProductoButton from "../../../components/Button";
import { View, StyleSheet } from "react-native";

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  step,
}) => {
  return (
    <View style={styles.container}>
      <ProductoButton
        onPress={handleOnPressSecondary}
        title={step === 1 ? "Create account" : "Change Email"}
        type="text"
        disabled={isLoading}
        size="md"
      />
      <ProductoButton
        onPress={handleOnPressPrimary}
        type="contained"
        size="md"
        loading={isLoading}
        title={step === 1 ? "Next" : "Log in"}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default FooterActions;
