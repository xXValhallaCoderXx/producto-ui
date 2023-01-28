import Button from "./Button";
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
