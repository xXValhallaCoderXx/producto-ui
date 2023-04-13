import { useState, useEffect } from "react";
import Button from "./Button";
import { Platform } from "react-native";
import { useKeyboard } from "@react-native-community/hooks";
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
  const keyboard = useKeyboard();
  const [bottom, setBottom] = useState(0);

  useEffect(() => {
    if (Platform.OS === "ios") {
      if (keyboard.keyboardShown) {
        setBottom(keyboard.keyboardHeight / 2);
      } else {
        setBottom(0);
      }
    }
  }, [keyboard.keyboardShown]);

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8, bottom }}
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
            textColor={theme.colors.secondary}
            onPress={onCancel}
            type="clear"
            // disabled={isLoading}
          />
          <Button
            onPress={onConfirm}
            title={confirmLabel ?? "Save"}
            textColor={theme.colors.error}
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
