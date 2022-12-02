import { Button, Text, Dialog, Portal, useTheme } from "react-native-paper";

const LogoutModal = ({ isVisible, onPress, onCancel }) => {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8, marginTop: -100 }}
        visible={isVisible}
        onDismiss={onCancel}
      >
        <Dialog.Content>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "700" }}
            color="black"
          >
            Confirm Delete
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.secondary,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Are you sure you want to delete this task?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button labelStyle={{ fontSize: 18 }} onPress={onCancel}>
            Cancel
          </Button>
          <Button
            labelStyle={{ color: theme.colors.error, fontSize: 18 }}
            onPress={onPress}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LogoutModal;