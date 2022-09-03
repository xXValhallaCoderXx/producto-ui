import { Text, Button } from "@rneui/base";
import { View } from "react-native";
import { useTheme } from "@rneui/themed";

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  step,
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        padding: 15,
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
        <Button
          onPress={handleOnPressSecondary}
          type="clear"
          color={theme.colors.primary}
          titleStyle={{ color: theme.colors.primary }}
          title={step === 1 ? "Create Account" : "Change Email"}
        />
        <Button
          color={theme.colors.primary}
          onPress={handleOnPressPrimary}
          containerStyle={{ width: 80, borderRadius: 8 }}
          title={step === 1 ? "Next" : "Log in"}
        />
      </View>
    </View>
  );
};

export default FooterActions;
