import ProductoButton from "../../../components/Button";
import { View } from "react-native";

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  disabledPrimary,
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ProductoButton
          onPress={handleOnPressSecondary}
          title={"Sign in instead"}
          type="text"
          contentStyle={{ paddingTop: 5, paddingBottom: 5 }}
          disabled={isLoading}
        />
        <ProductoButton
          onPress={handleOnPressPrimary}
          type="contained"
          loading={isLoading}
          title={step === 1 ? "Request OTP" : "Confirm OTP"}
          disabled={isLoading || disabledPrimary}
        />
      </View>
    </View>
  );
};

export default FooterActions;
