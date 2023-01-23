import { Button } from "react-native-paper";

const ProductoButton = ({
  onPress,
  title,
  style,
  size = "sm",
  type = "outlined",
  disabled,
  loading,
}) => {
  return (
    <Button
      mode={type}
      size={size}
      onPress={onPress}
      style={{ borderRadius: 10, ...style }}
      labelStyle={{ fontWeight: "700" }}
      loading={loading}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default ProductoButton;
