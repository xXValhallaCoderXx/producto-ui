import Button from "../../../../components/Button";
import { Dialog, Text, useTheme } from "react-native-paper";

const LogoutModal = ({ isVisible, onPress, onCancel }) => {
  const theme = useTheme();
  return (
    <Dialog
      style={{ backgroundColor: "white", borderRadius: 8 }}
      visible={isVisible}
      onDismiss={onCancel}
    >
      <Dialog.Title>Confim</Dialog.Title>
      <Dialog.Content>
        <Text
          color="secondary"
          customStyle={{ marginTop: 15, marginBottom: 20 }}
        >
          Are you sure you want to logout?
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          onPress={onPress}
          title="Log out"
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.error }}
          type="clear"
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={onCancel}
          type="clear"
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default LogoutModal;
