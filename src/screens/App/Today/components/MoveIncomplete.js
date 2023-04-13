import ProductoButton from "../../../../components/Button";
import { format, isAfter } from "date-fns";

const MoveIncomplete = ({
  onMoveIncomplete,
  currentDate,
  isLoading,
  tasks,
}) => {
  if (isLoading) {
    return null;
  }

  if (format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
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
