// import Button from "../../../../components/Button";
import { Dialog, Text, useTheme, Button } from "react-native-paper";

const LogoutModal = ({ isVisible, onPress, onCancel }) => {
  const theme = useTheme();
  return (
    <Dialog
      style={{ backgroundColor: "white", borderRadius: 8 }}
      visible={isVisible}
      onDismiss={onCancel}
    >
      <Dialog.Title style={{ fontSize: 24, fontWeight: "600" }}>
        Confirm
      </Dialog.Title>
      <Dialog.Content>
        <Text color="secondary" style={{ color: "#6B7280", fontSize: 16 }}>
          Are you sure you want to logout?
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          title="Cancel"
          labelStyle={{ fontSize: 14, fontWeight: "600" }}
          onPress={onCancel}
          type="clear"
        >
          Cancel
        </Button>
        <Button
          onPress={onPress}
          title="Log out"
          textColor="#D14343"
          labelStyle={{ fontSize: 14, fontWeight: "600" }}
          type="clear"
        >
          Logout
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default LogoutModal;
