import { forwardRef } from "react";
import { TextInput } from "react-native-paper";

const MainInput = forwardRef(
  (
    {
      label,
      value,
      mode = "outlined",
      error = false,
      style,
      onChangeText,
      secureTextEntry,
      rightIcon,
      onPressIcon,
      keyboardType,
      ...rest
    },
    ref
  ) => (
    <TextInput
      {...rest}
      label={label}
      value={value}
      mode={mode}
      error={error}
      theme={{ roundness: 10 }}
      outlineColor="#bcc5d6"
      keyboardType={keyboardType}
      ref={ref}
      style={{
        ...style,
        backgroundColor: "white",
        // width: "85%",
        fontSize: 14,
        // width: windowWidth * 0.85,
        // maxWidth: windowWidth * 0.9,
      }}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      right={
        rightIcon ? (
          <TextInput.Icon onPress={onPressIcon} icon={rightIcon} color="#fff" />
        ) : null
      }
    />
  )
);

export default MainInput;
