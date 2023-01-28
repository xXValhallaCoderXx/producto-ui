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

  if (isAfter(currentDate, new Date())) {
    return null;
  }

  if (!tasks || tasks.length === 0) {
    return null;
  }

  if (tasks.every((task) => task.completed === true)) {
    return null;
  } else {
    return (
      <ProductoButton
        onPress={onMoveIncomplete}
        disabled={isLoading}
        loading={isLoading}
        containerStyle={{ width: 160, borderRadius: 8 }}
        type="contained"
        title="Move Incomplete"
      />
    );
  }
};

export default MoveIncomplete;
