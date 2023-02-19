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

  // if (tasks.every((task) => task.completed === true)) {
  //   return null;
  // } else {
  //   return (
  //     <ProductoButton
  //       onPress={onMoveIncomplete}
  //       disabled={
  //         isLoading || isAfter(currentDate, new Date()) || tasks.length === 0
  //       }
  //       loading={isLoading}
  //       containerStyle={{ width: 160, borderRadius: 8 }}
  //       type="contained"
  //       title="Move Incomplete"
  //     />
  //   );
  // }
};

export default MoveIncomplete;
