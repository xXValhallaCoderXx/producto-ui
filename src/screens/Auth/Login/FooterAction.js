import ProductoButton from "../../../components/Button";
import { View } from "react-native";

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  step,
}) => {
  return (
    <View
      style={{
        padding: 25,
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ProductoButton
          onPress={handleOnPressSecondary}
          title={step === 1 ? "Create account" : "Change Email"}
          type="text"
          disabled={isLoading}
        />
        <ProductoButton
          onPress={handleOnPressPrimary}
          type="contained"
          loading={isLoading}
          title={step === 1 ? "Next" : "Log in"}
        />
      </View>
    </View>
  );
};

export default FooterActions;
