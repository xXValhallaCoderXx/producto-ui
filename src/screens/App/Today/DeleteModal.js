import { Button, Text, Dialog, Portal, useTheme } from "react-native-paper";

const DeleteTaskModal = ({ isVisible, onPress, onCancel, isLoading }) => {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8 }}
        visible={isVisible}
        onDismiss={onCancel}
      >
        <Dialog.Content>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "600" }}
            color="black"
          >
            Confirm Delete
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.secondary,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Are you sure you want to delete this task?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            style={{ color: theme.colors.error }}
            onPress={onPress}
          >
            Delete
          </Button>
          <Button
            disabled={isLoading}
            style={{ color: theme.colors.primary }}
            onPress={onCancel}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteTaskModal;
