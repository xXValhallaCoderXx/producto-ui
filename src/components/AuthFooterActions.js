import { View } from "react-native";
import ContainedButton from "./ContainedButton";
import TextButton from "./TextButton";

const AuthFooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  secondaryText,
  primaryText,
  disabled,
  loading
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
        <TextButton onPress={handleOnPressSecondary} disabled={disabled}>
          {secondaryText}
        </TextButton>
        <ContainedButton loading={loading} onPress={handleOnPressPrimary} disabled={disabled}>
          {primaryText}
        </ContainedButton>
      </View>
    </View>
  );
};

export default AuthFooterActions;
