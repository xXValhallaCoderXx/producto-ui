import ProductoButton from "../../../components/Button";
import { View } from "react-native";

const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

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
          size="md"
        />
        <ProductoButton
          onPress={handleOnPressPrimary}
          type="contained"
          size="md"
          loading={isLoading}
          title={step === 1 ? "Next" : "Log in"}
          disabled={isLoading}
          // disabled={
          //   isLoading ||
          //   (step === 1 && !email.match(validEmailRegex)) ||
          //   (step === 2 && password === "")
          // }
        />
      </View>
    </View>
  );
};

export default FooterActions;
