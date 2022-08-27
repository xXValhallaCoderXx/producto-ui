import { StyleSheet, View } from "react-native";
import { Input, useTheme, Button, Icon } from "@rneui/themed";
import { format, add, sub, isEqual } from "date-fns";

const MoveIncomplete = ({ onMoveIncomplete, currentDate }) => {
  const { theme } = useTheme();

  if (format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Button color={theme.colors.primary} title="Move incomplete tasks" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default MoveIncomplete;
