import { Button, Text, Dialog, Portal, useTheme } from "react-native-paper";

const LogoutModal = ({ isVisible, onPress, onCancel }) => {
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
            Confirm
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.secondary,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Are you sure you want to logout?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={{ color: theme.colors.error }} onPress={onPress}>
            Log out
          </Button>
          <Button style={{ color: theme.colors.primary }} onPress={onCancel}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LogoutModal;
