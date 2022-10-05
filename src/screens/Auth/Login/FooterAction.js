import { Button } from "@rneui/base";
import { View } from "react-native";
import { useTheme } from "@rneui/themed";

const validEmailRegex = /^[a-zA-Z]+[a-zA-Z0-9_.]+@[a-zA-Z.]+[a-zA-Z]$/;

const FooterActions = ({
  handleOnPressPrimary,
  handleOnPressSecondary,
  isLoading,
  step,
  email,
  password,
}) => {
  const { theme } = useTheme();
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
        <Button
          onPress={handleOnPressSecondary}
          type="clear"
          color={theme.colors.primary}
          titleStyle={{ color: theme.colors.primary }}
          title={step === 1 ? "Create Account" : "Change Email"}
          disabled={isLoading}
        />
        <Button
          color={theme.colors.primary}
          onPress={handleOnPressPrimary}
          containerStyle={{ width: 80, borderRadius: 8 }}
          title={step === 1 ? "Next" : "Log in"}
          disabled={
            isLoading ||
            (step === 1 && !email.match(validEmailRegex)) ||
            (step === 2 && password === "")
          }
        />
      </View>
    </View>
  );
};

export default FooterActions;
