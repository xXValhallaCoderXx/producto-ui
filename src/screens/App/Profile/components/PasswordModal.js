import { Button } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Text } from "../../../../components";
import { useTheme } from "@rneui/themed";

const PasswordModal = ({ isVisible, onPress, onCancel }) => {
  const { theme } = useTheme();
  return (
    <Dialog isVisible={isVisible} onBackdropPress={onCancel}>
      <Text type="h2" color="black">
        Change Password
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Enter your current password, and your new one.
      </Text>

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

export default PasswordModal;
