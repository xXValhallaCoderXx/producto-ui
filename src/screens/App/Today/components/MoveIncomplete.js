import ProductoButton from "../../../../components/Button";
import { format, isBefore, isAfter, isSameDay } from "date-fns";

const MoveIncomplete = ({
  onMoveIncomplete,
  currentDate,
  isLoading,
  tasks,
}) => {
  if (isLoading) {
    return null;
  }

  if (isBefore(new Date(), currentDate) || isSameDay(new Date(), currentDate)) {
    return null;
  }

  return (
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
  );
};

export default MoveIncomplete;
