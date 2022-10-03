import { TextInput } from "react-native";
import { StyleSheet } from "react-native";

const ProductoInput = ({
  onChangeText,
  value,
  id,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      nativeID={id}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {

    height: 45,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default ProductoInput;
