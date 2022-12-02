import { StyleSheet, View, Platform } from "react-native";
import ContainedButton from "../../../components/ContainedButton";
import { format } from "date-fns";

const MoveIncomplete = ({
  onMoveIncomplete,
  currentDate,
  isLoading,
  tasks,
}) => {
//   if (format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
//     return null;
//   }

  if (!tasks || tasks.length === 0) {
    return null;
  }

  // if (tasks.every((task) => task.completed === true)) {
  //   return null;
  // }

  return (
    <ContainedButton
      onPress={onMoveIncomplete}
      disabled={isLoading || tasks.every((task) => task.completed === true)}
      loading={isLoading}
    >
      Move Incomplete
    </ContainedButton>
  );
};

export default MoveIncomplete;
