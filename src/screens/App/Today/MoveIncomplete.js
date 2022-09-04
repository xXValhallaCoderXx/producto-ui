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
        containerStyle={{ width: 160, borderRadius: 8 }}
        color={theme.colors.primary}
        title="Move incomplete"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    alignItems: "center",
  },
});

export default MoveIncomplete;
