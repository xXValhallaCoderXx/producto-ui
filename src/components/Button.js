
import { Button as REButton } from "@rneui/themed";

const Button = ({ onPress, title, color, type = "solid" }) => {
  return (
    <REButton
      title={title}
      type={type}
      size="lg"

      onPress={onPress}
      titleStyle={{ fontWeight: "700", fontSize: 25 }}
      buttonStyle={{

        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
      }}
      containerStyle={{
        width: "70%",
        marginHorizontal: 50,
        marginVertical: 10,
      }}
    />
  );
};


export default Button;
