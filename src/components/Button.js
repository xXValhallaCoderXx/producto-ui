import { Button } from "react-native-paper";

const ProductoButton = ({
  onPress,
  title,
  style,
  type = "outlined",
  disabled,
  loading,
}) => {
  return (
    <Button
      mode={type}
      size="sm"
      onPress={onPress}
      style={{ borderRadius: 10, paddingTop: 4, paddingBottom: 4, ...style }}
      labelStyle={{ fontWeight: "700", fontSize: 15 }}
      loading={loading}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default ProductoButton;
