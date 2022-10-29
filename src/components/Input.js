import React from "react";
import { TextInput } from "react-native-paper";

const CustomNavbarBrand = React.forwardRef(({   placeholder,
  secureTextEntry = false,
  label,
  value,
  error = false,
  style,
  onChange,
  keyboardType,
  right,
  ...rest }, ref) => {
  return (
    <TextInput
    label={label}
    value={value}
    mode="outlined"
    error={error}
    outlineColor="#bcc5d6"
    ref={ref}
    placeholder={placeholder}
    theme={{ roundness: 10 }}
    style={{
      backgroundColor: "white",
      height: 55,
      fontSize: 17,
      ...style,
    }}
    onChangeText={onChange}
    keyboardType={keyboardType}
    secureTextEntry={secureTextEntry}
    right={right}
    {...rest}
  />
  )
})

// const ProductoInput = ({
//   placeholder,
//   secureTextEntry = false,
//   label,
//   value,
//   error = false,
//   ref,
//   style,
//   onChange,
//   keyboardType,
//   right,
//   ...rest
// }) => {
//   return (
//     <TextInput
//       label={label}
//       value={value}
//       mode="outlined"
//       error={error}
//       outlineColor="#bcc5d6"
//       ref={ref}
//       placeholder={placeholder}
//       theme={{ roundness: 10 }}
//       style={{
//         backgroundColor: "white",
//         height: 55,
//         fontSize: 17,
//         ...style,
//       }}
//       onChangeText={onChange}
//       keyboardType={keyboardType}
//       secureTextEntry={secureTextEntry}
//       right={right}
//       {...rest}
//     />
//   );
// };

export default CustomNavbarBrand;
