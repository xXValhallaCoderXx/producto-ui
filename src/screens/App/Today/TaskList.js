import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, ToastAndroid } from "react-native";

import { useUpdateTaskMutation } from "../../../api/task-api";
import DeleteTaskModal from "./DeleteModal";
import { Text, useTheme } from "react-native-paper";
import DraggbleList from "./components/DraggableList";
import { useDeleteTaskMutation } from "../../../api/task-api";

const TaskList = ({
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  utcDate,
}) => {
  const theme = useTheme();
  const [editTask, setEditTask] = useState(null);
  const focusMode = useSelector((state) => state.today.focusMode);
  const [value, setTaskValue] = useState("");
  const [updateTaskApi, updateTaskInfo] = useUpdateTaskMutation();
  const onCheckTask = (_task) => () => handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => () => handleToggleTaskFocus(_task);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();

  useEffect(() => {
    if (deleteTaskApiResults.isSuccess) {
      setIsDeleteModalVisible(false);
      setEditTask(null);
      ToastAndroid.show(`Task deleted!`, ToastAndroid.SHORT);
    }
  }, [deleteTaskApiResults]);

  const handleOnPressDelete = () => (_id) => {
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
        <View>
          <Text style={{ marginTop: 15 }}>
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
          onCheckTask={onCheckTask}
          onToggleFocus={onToggleFocus}
        />
        // <ScrollView style={{ marginTop: 15, padding: 3 }}>
        //   {tasks
        //     .filter((task) => {
        //       if (!editMode && !task.focus && !task.completed) {
        //         return false;
        //       }
        //       return task;
        //     })
        //     .map((task, index) => {
        //       if (task.id === editTask) {
        //         return (
        //           <ListItem
        //             key={index}
        //             onLongPress={handleOnLongPress(task)}
        //             containerStyle={{
        //               paddingTop: 15,
        //               paddingBottom: 15,
        //               paddingLeft: 0,
        //               paddingRight: 0,
        //               borderBottomColor: "#e7e8f0",
        //               borderBottomWidth: 1,
        //             }}
        //           >
        //             <ListItem.Content style={styles.listContent}>
        //               <View style={styles.listRow}>
        //                 <TextInput
        //                   onChangeText={handleOnChange}
        //                   value={value}
        //                   onBlur={handleOnBlur}
        //                   underlineColorAndroid="transparent"
        //                   style={{
        //                     fontSize: 16,

        //                     backgroundColor: "white",
        //                   }}
        //                 />
        //               </View>
        //               <View
        //                 style={{
        //                   justifyContent: "flex-end",
        //                   ...styles.listRow,
        //                   marginRight: 15,
        //                   height: 35,
        //                 }}
        //               >
        //                 <TouchableOpacity onPress={handleOnPressDelete}>
        //                   <MaterialIcons
        //                     name="trash-o"
        //                     color={"#6B7280"}
        //                     style={{ fontSize: 25 }}
        //                   />
        //                 </TouchableOpacity>
        //               </View>
        //               {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
        //             </ListItem.Content>
        //           </ListItem>
        //         );
        //       }
        //       return (
        //         <ListItem
        //           key={index}
        //           onPress={onCheckTask(task)}
        //           onLongPress={handleOnLongPress(task)}
        //           containerStyle={{
        //             paddingTop: 15,
        //             paddingBottom: 15,
        //             paddingLeft: 2,
        //             paddingRight: 0,
        //             borderBottomColor: "#e7e8f0",
        //             borderBottomWidth: 1,
        //             borderTopWidth: 0,
        //           }}
        //         >
        //           <ListItem.Content style={styles.listContent}>
        // <View style={styles.listRow}>
        //   {editMode && currentDate === todayDate && (
        //     <IoniIcons
        //       style={{
        //         fontSize: 22,
        //         marginRight: 20,
        //         transform: [{ rotate: "45deg" }],
        //       }}
        //       color={task.focus ? theme.colors.primary : "black"}
        //       name={"key-outline"}
        //       onPress={onToggleFocus(task)}
        //     />
        //   )}
        //   <ListItem.Title
        //     style={{
        //       color: task.completed ? "gray" : "black",
        //       textDecorationLine: task.completed
        //         ? "line-through"
        //         : "none",
        //     }}
        //   >
        //     {task.title}
        //   </ListItem.Title>
        // </View>
        // <View>
        //   <CheckBox
        //     checked={task.completed}
        //     containerStyle={{ padding: 0 }}
        //     onPress={onCheckTask(task)}
        //     disabled={task.id === currentTask && isLoadingToggle}
        //   />
        // </View>
        //           </ListItem.Content>
        //         </ListItem>
        //       );
        //     })}
        // </ScrollView>
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

const styles = StyleSheet.create({
  listContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listRow: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default TaskList;
