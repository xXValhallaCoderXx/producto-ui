import { Button } from "react-native-paper";

const TextButton = ({ children, disabled, onPress, loading }) => {
  return (
    <Button
      mode="text"
      size="sm"
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

export default TextButton;
