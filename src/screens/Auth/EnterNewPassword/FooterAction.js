import ProductoButton from "../../../components/Button";
import { View } from "react-native";

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  disabledPrimary,
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
          title={"Submit"}
          disabled={isLoading || disabledPrimary}
        />
      </View>
    </View>
  );
};

export default FooterActions;
