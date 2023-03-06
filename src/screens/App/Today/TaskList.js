import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View } from "react-native";

import { Text, useTheme } from "react-native-paper";
import DraggbleList from "./components/DraggableList";
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
  const theme = useTheme();
  const [editTask, setEditTask] = useState(null);
  const focusMode = useSelector((state) => state.today.focusMode);

  // const onCheckTask = (_task) =>  handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => (e) => {
    e.stopPropagation();
    handleToggleTaskFocus(_task);
  };
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();

  useEffect(() => {
    if (deleteTaskApiResults.isSuccess) {
      setIsDeleteModalVisible(false);
      setEditTask(null);
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
    setEditTask(_id);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
    setEditTask(null);
  };

  const handleDeleteTask = async () => {
    await deleteTaskApi({ id: editTask });
    setEditTask(null);
  };

  return (
    <View>
      {tasks.length === 0 && !focusMode ? (
        <View style={{ paddingLeft: 25, marginTop: 20 }}>
          <Text>No task added to focus mode yet</Text>
        </View>
      ) : (
        <DraggbleList
          tasks={tasks.filter((task) => {
            // if (!focusMode && !task.focus && !task.completed) {
            //   return false;
            // }
            if (!focusMode && task.focus) {
              return task;
            } else if (focusMode) {
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
