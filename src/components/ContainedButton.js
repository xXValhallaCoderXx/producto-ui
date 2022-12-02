import { Button } from "react-native-paper";

const ContainedButton = ({ children, disabled, onPress, loading, icon }) => {
  return (
    <Button
      mode="contained"
      size="sm"
      icon={icon}
      onPress={onPress}
      style={{ borderRadius: 10, paddingTop: 5, paddingBottom: 5 }}
      labelStyle={{ fontWeight: "700", fontSize: 16 }}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ContainedButton;
