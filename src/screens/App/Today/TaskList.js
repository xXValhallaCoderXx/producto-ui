import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useToast } from "react-native-toast-notifications";
import DeleteTaskModal from "./DeleteModal";
import { Text, useTheme } from "@rneui/themed";

import DraggbleList from "./components/DraggableList";
import { useDeleteTaskMutation } from "../../../api/task-api";
import AddItem from "./AddItem";
import DraggableFlatList, {
  OpacityDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";
const TaskList = ({
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  utcDate,
  keyboardShown,
  handleCreateNewTask,
  keyboardHeight,
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
  console.log("HMMMM: ", keyboardShown)
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
    <View>
      {tasks.length === 0 ? (
        <View>
          <Text style={{ marginTop: 15 }}>
            Add a task to start your{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
              productivity!
            </Text>
          </Text>
          <AddItem
            handleCreateNewTask={handleCreateNewTask}
            currentDate={utcDate}
          />
        </View>
      ) : (
        <View style={{height: "100%"}}>
 <KeyboardAvoidingView
        style={{backgroundColor: "red"}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 230}
      >
         <View style={{maxHeight: "80%"}}>
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
            keyboardShown={keyboardShown}
            keyboardHeight={keyboardHeight}
          />
         </View>
    
        </KeyboardAvoidingView>

        <AddItem
            handleCreateNewTask={handleCreateNewTask}
            currentDate={utcDate}
          />
          </View>
       
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
