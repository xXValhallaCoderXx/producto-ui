import { StyleSheet, View } from "react-native";
import { useTheme, Button } from "@rneui/themed";
import { format } from "date-fns";

const MoveIncomplete = ({
  onMoveIncomplete,
  currentDate,
  isLoading,
  tasks,
}) => {
  const { theme } = useTheme();

  if (format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
    return null;
  }

  if (!tasks || tasks.length === 0) {
    return null;
  }

  if (tasks.every((task) => task.completed === true)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={onMoveIncomplete}
        disabled={isLoading}
        loading={isLoading}
        color={theme.colors.primary}
        title="Move incomplete tasks"
      />
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
