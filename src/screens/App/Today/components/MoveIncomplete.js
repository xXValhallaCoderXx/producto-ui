import { useSelector } from "react-redux";
import ProductoButton from "../../../../components/Button";
import { isBefore, isAfter, isSameDay } from "date-fns";
import { View } from "react-native";
const MoveIncomplete = ({
  onMoveIncomplete,
  currentDate,
  isLoading,
  tasks,
}) => {
  const addTaskMode = useSelector((state) => state.today.addTaskMode);
  const editingTask = useSelector((state) => state.today.editingTask);

  if (isLoading | addTaskMode | Boolean(editingTask)) {
    return null;
  }

  if (isBefore(new Date(), currentDate) || isSameDay(new Date(), currentDate)) {
    return null;
  }

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <ProductoButton
        onPress={onMoveIncomplete}
        disabled={
          isLoading ||
          !tasks ||
          isAfter(currentDate, new Date()) ||
          tasks?.length === 0 ||
          tasks?.every((task) => task.completed === true)
        }
        loading={isLoading}
        containerStyle={{ width: 160, borderRadius: 8 }}
        type="contained"
        title="Move Incomplete"
      />
    </View>
  );
};

export default MoveIncomplete;
