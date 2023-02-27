import { useState, useEffect } from "react";
import Button from "./Button";
import { Keyboard } from "react-native";
import { useTheme, Text, Dialog, Portal } from "react-native-paper";

const ConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  isLoading,
  title,
  description,
  confirmLabel,
}) => {
  const theme = useTheme();
  // const [bottom, setBottom] = useState(0);

  // useEffect(() => {
  //   function onKeyboardChange(e) {
  //     console.log("E: ", e);
  //     if (e.endCoordinates.screenY < e.startCoordinates.screenY)
  //       setBottom(e.endCoordinates.height / 2);
  //     else setBottom(0);
  //   }

  //   if (Platform.OS === "ios") {
  //     const subscription = Keyboard.addListener(
  //       "keyboardWillChangeFrame",
  //       onKeyboardChange
  //     );
  //     return () => subscription.remove();
  //   }

  //   const subscriptions = [
  //     Keyboard.addListener("keyboardDidHide", onKeyboardChange),
  //     Keyboard.addListener("keyboardDidShow", onKeyboardChange),
  //   ];
  //   return () => subscriptions.forEach((subscription) => subscription.remove());
  // }, []);

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8 }}
        visible={isVisible}
        onDismiss={onCancel}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: theme.colors.secondary, fontSize: 16 }}>
            {description}
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            title="Cancel"
            textColor={theme.colors.error}
            onPress={onCancel}
            type="clear"
            // disabled={isLoading}
          />
          <Button
            onPress={onConfirm}
            title={confirmLabel ?? "Save"}
            textColor={theme.colors.primary}
            type="clear"
            disabled={isLoading}
            style={{ width: 40 }}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmationModal;
