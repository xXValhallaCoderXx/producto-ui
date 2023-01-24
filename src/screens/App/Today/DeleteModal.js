import Button from "../../../components/Button";
import { useTheme, Dialog, Text } from "react-native-paper";

const DeleteTaskModal = ({ isVisible, onPress, onCancel, isLoading }) => {
  const theme = useTheme();
  return (
    // <Portal>
    <Dialog
      style={{ backgroundColor: "white", borderRadius: 8 }}
      visible={isVisible}
      onDismiss={onCancel}
    >
      <Dialog.Title>Confirm Delete</Dialog.Title>
      <Dialog.Content>
        <Text customStyle={{ marginTop: 15, marginBottom: 20 }}>
          Are you sure you want to delete this task?
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          onPress={onPress}
          title="Delete"
          titleStyle={{ color: theme.colors.error }}
          type="clear"
          disabled={isLoading}
          loading={isLoading}
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={onCancel}
          type="clear"
          disabled={isLoading}
        />
      </Dialog.Actions>
    </Dialog>
    // </Portal>
  );
};

export default DeleteTaskModal;
