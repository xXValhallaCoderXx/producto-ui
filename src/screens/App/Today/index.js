import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import httpClient from "../../../api/api-handler";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";
import { useGetTodaysTasksQuery, useToggleTaskMutation } from "../../../api";

const ListScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  const { data: tasks, isLoading, error } = useGetTodaysTasksQuery();
  const [
    toggleTask,
    {
      isError: isToggleError,
      isSuccess: isToggleSuccess,
      isLoading: isToggleLoading,
      data: toggleData
    },
  ] = useToggleTaskMutation();


  useEffect(() => {
    if (tasks) {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.completed).length;
      setProgress(Math.round((completed / total) * 100) / 100);
    }
  }, [tasks]);

  const handleToggleTaskComplete = async (_task) => {
    // try {
    //   await httpClient.patch(`/task/${_task.id}`, {
    //     completed: !_task.completed,
    //   });
    //   ToastAndroid.show(`Task ${_task.title} updated!`, ToastAndroid.SHORT);
    //   // await fetchTasks();
    // } catch (err) {
    //   console.log("TOGGLE COMPLETE ERROR: ", err.response);
    // }
    console.log("LEGGO")
    await toggleTask(_task.id, !completed)
  };
  console.log("toggleData", toggleData)
  console.log("isToggleLoading", isToggleLoading)

  // const handleToggleTaskFocus = async (_task) => {
    // try {
    //   setCurrentTask(task.id);
    //   setIsLoadingToggle(true);
    //   await httpClient.patch(`/task/${_task.id}`, {
    //     focus: !_task.focus,
    //   });
    //   ToastAndroid.show(`Task ${_task.title} updated!`, ToastAndroid.SHORT);
    //   setCurrentTask("");
    //   setIsLoadingToggle(false);
    //   // await fetchTasks();
    // } catch (err) {
    //   console.log("TOGGLE FOCUS ERROR: ", err.response);
    // }
 
  // };

  // const handleCreateNewTask = async (_title) => {
  //   try {
  //     ToastAndroid.show(`Task ${_title} created!`, ToastAndroid.SHORT);
  //     // await fetchTasks();
  //     return;
  //   } catch (err) {
  //     console.log("ERROR CRESATING TASK:", err.response);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Header editMode={editMode} />
      <ProgressBar editMode={editMode} progress={progress} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TaskList
          tasks={tasks || []}
          editMode={editMode}
          handleToggleTaskFocus={() => console.log("")}
          handleToggleTaskComplete={handleToggleTaskComplete}
          currentTask={currentTask}
          isLoadingToggle={isLoadingToggle}
        />
        {/* 
        <AddItem
          handleCreateNewTask={handleCreateNewTask}
          fetchTasks={() => console.log("add")}
          editMode={editMode}
        /> */}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 15,
    flexDirection: "column",
    padding: 30,
  },
});

export default ListScreen;
