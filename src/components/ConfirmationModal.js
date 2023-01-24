import Button from "./Button";
import { useTheme, Text, Dialog } from "react-native-paper";

const ConfirmationModal = ({
  isVisible,
  onCancel,
  isLoading,
  title,
  description,
}) => {
  const theme = useTheme();

  return (
    <Dialog visible={isVisible} onDismiss={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text customStyle={{ marginTop: 15, marginBottom: 20 }}>
          {description}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          onPress={handleOnSubmit}
          title="Save"
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
          disabled={isLoading}
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
  );
};

export default ConfirmationModal;
