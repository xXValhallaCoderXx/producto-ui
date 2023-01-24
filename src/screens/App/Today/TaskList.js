import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View } from "react-native";

import { useUpdateTaskMutation } from "../../../api/task-api";
import DeleteTaskModal from "./DeleteModal";
import { Text, useTheme } from "react-native-paper";
import DraggbleList from "./components/DraggableList";
import { useDeleteTaskMutation } from "../../../api/task-api";
import { useToast } from "react-native-toast-notifications";

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
  const [value, setTaskValue] = useState("");
  const [updateTaskApi, updateTaskInfo] = useUpdateTaskMutation();
  // const onCheckTask = (_task) =>  handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => () => handleToggleTaskFocus(_task);
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
      {tasks.length === 0 ? (
        <View style={{ paddingLeft: 5, marginTop: 15 }}>
          <Text>
            Add a task to start your{" "}
            <Text style={{ fontWeight: "700" }}>productivity!</Text>
          </Text>
        </View>
      ) : (
        <DraggbleList
          tasks={tasks.filter((task) => {
            if (!focusMode && !task.focus && !task.completed) {
              return false;
            }
            return task;
          })}
          handleOnPressDelete={handleOnPressDelete}
          utcDate={utcDate}
          onCheckTask={handleToggleTaskComplete}
          onToggleFocus={onToggleFocus}
        />
      )}
      <DeleteTaskModal
        isVisible={isDeleteModalVisible}
        onPress={handleDeleteTask}
        onCancel={toggleDeleteModal}
        isLoading={deleteTaskApiResults.isLoading}
      />
    </View>
  );
};

export default TaskList;
