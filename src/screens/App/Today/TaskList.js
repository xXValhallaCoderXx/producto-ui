import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View } from "react-native";
import { startOfDay, endOfDay } from "date-fns";
import { selectCurrentDate } from "./today-slice";
import { Text } from "react-native-paper";
import DraggbleList from "./components/DraggableList";
import { setEditingTask } from "./today-slice";
import { useDeleteTaskMutation } from "../../../api/task-api";
import { useToast } from "react-native-toast-notifications";
import ConfirmationModal from "../../../components/ConfirmationModal";

const TaskList = ({
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  utcDate,
}) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = useSelector(selectCurrentDate);

  const editTaskId = useSelector((state) => state.today.editingTask);

  const onToggleFocus = (_task) => (e) => {
    e.stopPropagation();
    handleToggleTaskFocus(_task);
  };
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();

  useEffect(() => {
    if (deleteTaskApiResults.isSuccess) {
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Task Deleted!`,
        description: "",
      });
    }
  }, [deleteTaskApiResults]);

  const handleOnPressDelete = (_id) => {
    setIsDeleteModalVisible(true);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
    // setEditTask(null);
  };

  const handleDeleteTask = async () => {
    deleteTaskApi({
      id: editTaskId,
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
    setIsDeleteModalVisible(false);
    dispatch(setEditingTask(null));
  };

  const tasksToDisplay = () => {
    return tasks.filter((task) => {
      if (task.focus) {
        return task;
      }
      return false;
    });
  };

  return (
    <View>
      {tasksToDisplay().length === 0 && focusMode ? (
        <View style={{ paddingLeft: 25, marginTop: 20 }}>
          <Text>No task added to focus mode yet</Text>
        </View>
      ) : (
        <DraggbleList
          tasks={tasks.filter((task) => {
            if (focusMode && task.focus) {
              return task;
            } else if (!focusMode) {
              return task;
            }
            return false;
          })}
          handleOnPressDelete={handleOnPressDelete}
          utcDate={utcDate}
          onCheckTask={handleToggleTaskComplete}
          onToggleFocus={onToggleFocus}
        />
      )}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        onConfirm={handleDeleteTask}
        onCancel={toggleDeleteModal}
        confirmLabel="Confirm"
        isLoading={deleteTaskApiResults.isLoading}
      />
    </View>
  );
};

export default TaskList;
