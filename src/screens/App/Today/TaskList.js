import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useToast } from "react-native-toast-notifications";
import DeleteTaskModal from "./DeleteModal";
import { Text, useTheme } from "@rneui/themed";
import DraggbleList from "./components/DraggableList";
import { useDeleteTaskMutation } from "../../../api/task-api";
import AddItem from "./AddItem";
const TaskList = ({
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  utcDate,
}) => {
  const toast = useToast();
  const { theme } = useTheme();
  const [editTask, setEditTask] = useState(null);
  const focusMode = useSelector((state) => state.today.focusMode);

  const onCheckTask = (_task) => () => handleToggleTaskComplete(_task);
  const onCheckTaskRow = (_task) => handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => () => handleToggleTaskFocus(_task);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();

  useEffect(() => {
    if (deleteTaskApiResults.isSuccess) {
      setEditTask(null);
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Task deleted!`,
        description: "",
      });
    }
  }, [deleteTaskApiResults]);

  const handleOnPressDelete = (_id) => () => {
    setIsDeleteModalVisible(true);
    setEditTask(_id);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
    setEditTask(null);
  };

  const handleDeleteTask = async () => {
    setIsDeleteModalVisible(false);
    await deleteTaskApi({ id: editTask, date: format(utcDate, "yyyy-MM-dd") });
    setEditTask(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {tasks.length === 0 ? (
        <View>
          <Text style={{ marginTop: 15 }}>
            Add a task to start your{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
              productivity!
            </Text>
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1, overflow: "hidden" }}
          behavior={Platform.OS === "ios" ? "position" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 70}
        >
          <DraggbleList
            tasks={tasks.filter((task) => {
              if (!focusMode && !task.focus && !task.completed) {
                return false;
              }
              return task;
            })}
            handleOnPressDelete={handleOnPressDelete}
            utcDate={utcDate}
            onCheckTask={onCheckTask}
            onCheckTaskRow={onCheckTaskRow}
            onToggleFocus={onToggleFocus}
          />

          <AddItem
            handleCreateNewTask={() => console.log("CLICK")}
            currentDate={utcDate}
          />
        </KeyboardAvoidingView>
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
