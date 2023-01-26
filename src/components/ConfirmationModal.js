import Button from "./Button";
import { useTheme, Text, Dialog, Portal } from "react-native-paper";

const ConfirmationModal = ({
  isVisible,
  onCancel,
  onConfirm,
  isLoading,
  title,
  description,
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
            onPress={onConfirm}
            title="Save"
            textColor={theme.colors.primary}
            type="clear"
            disabled={isLoading}
            style={{ width: 40 }}
          />
          <Button
            title="Cancel"
            textColor={theme.colors.error}
            onPress={onCancel}
            type="clear"
            // disabled={isLoading}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmationModal;
