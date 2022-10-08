import { Button } from "react-native-paper";

const ProductoButton = ({
  onPress,
  title,
  color,
  type = "outlined",
  disabled,
  loading,
}) => {
  return (
    <Button
      mode={type}
      size="lg"
      onPress={onPress}
      style={{ borderRadius: 10 }}
      labelStyle={{ fontWeight: "700" }}
      loading={loading}
      disabled={disabled}
      // buttonStyle={{
      //   borderColor: "transparent",
      //   borderWidth: 0,
      //   borderRadius: 30,
      // }}
      // containerStyle={{
      //   width: "70%",
      //   marginHorizontal: 50,
      //   marginVertical: 10,
      // }}
    >
      {title}
    </Button>
  );
};

export default ProductoButton;
