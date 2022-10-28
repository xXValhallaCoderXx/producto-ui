import ProductoButton from "../../../components/Button";
import { View } from "react-native";

const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  disabledPrimary,
}) => {
  console.log("DISB: ", disabledPrimary)
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
          title={"Sign in instead"}
          type="text"
          disabled={isLoading}
        />
        <ProductoButton
          onPress={handleOnPressPrimary}
          type="contained"
          loading={isLoading}
          title={"Create"}
          disabled={isLoading || disabledPrimary}
        />
      </View>
    </View>
  );
};

export default FooterActions;
