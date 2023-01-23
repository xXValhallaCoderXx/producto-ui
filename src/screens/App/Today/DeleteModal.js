import { View } from "react-native";
import Button from "../../../components/Button";

import { useTheme, Dialog, Text } from "react-native-paper";
// import { Text } from "../../../components";
// import { useTheme } from "@rneui/themed";

const DeleteTaskModal = ({ isVisible, onPress, onCancel, isLoading }) => {
  const theme = useTheme();
  return (
    <Dialog visible={isVisible} onDismiss={onCancel}>
      <Text type="h2" color="black">
        Confirm Delete
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Are you sure you want to delete this task?s
      </Text>

      <Dialog.Actions>
        <Button
          onPress={onPress}
          title="Delete"
          // containerStyle={{ paddingLeft: 25, width: 100 }}
          // titleStyle={{ color: theme.colors.error }}
          type="clear"
          disabled={isLoading}
          loading={isLoading}
        />

        <Button
          title="Cancel"
          // titleStyle={{ color: theme.colors.primary }}
          onPress={onCancel}
          type="clear"
          disabled={isLoading}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteTaskModal;
