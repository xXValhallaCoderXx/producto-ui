import { Button } from "react-native-paper";

const SIZE_MAP = {
  sm: {
    style: {
      paddingHorizontal: 18,
      paddingVertical: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
    },
  },
  md: {
    style: {
      paddingHorizontal: 0,
      margin: 0,
      paddingVertical: 3,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
    },
  },
};

const ProductoButton = ({
  onPress,
  title,
  style,
  type = "outlined",
  size = "md",
  disabled,
  loading,
}) => {
  return (
    <Button
      mode={type}
      onPress={onPress}
      contentStyle={{ paddingHorizontal: 10 }}
      style={{ borderRadius: 8, ...style, ...SIZE_MAP[size].style }}
      labelStyle={{ ...SIZE_MAP[size].label }}
      loading={loading}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default ProductoButton;
