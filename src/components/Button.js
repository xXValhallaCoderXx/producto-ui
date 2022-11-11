import { Button } from "react-native-paper";

const ProductoButton = ({
  onPress,
  title,
  style,
  type = "outlined",
  disabled,
  loading,
  size= "sm"
}) => {
  return (
    <Button
      mode={type}
      size={size}
      onPress={onPress}
      style={{ borderRadius: 10, paddingTop: 5, paddingBottom: 5, ...style }}
      labelStyle={{ fontWeight: "700", fontSize: 16 }}
      loading={loading}
      disabled={loading || disabled}
    >
      {title}
    </Button>
  );
};

export default ProductoButton;
