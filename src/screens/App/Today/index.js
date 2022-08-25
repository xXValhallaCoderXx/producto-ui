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

const ListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    setProgress(Math.round((completed / total) * 100) / 100);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      // const queryDate = moment(new Date()).format("YYYY/MM/DD")
      const response = await httpClient.get(`/task`);
      setTasks(response.data);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  const handleToggleTaskComplete = async (_task) => {
    try {
      await httpClient.patch(`/task/${_task.id}`, {
        completed: !_task.completed,
      });
      ToastAndroid.show(`Task ${_task.title} updated!`, ToastAndroid.SHORT);
      await fetchTasks();
    } catch (err) {
      console.log("TOGGLE COMPLETE ERROR: ", err.response);
    }
  };

  const handleToggleTaskFocus = async (_task) => {
    try {
      setCurrentTask(task.id);
      setIsLoadingToggle(true);
      await httpClient.patch(`/task/${_task.id}`, {
        focus: !_task.focus,
      });
      ToastAndroid.show(`Task ${_task.title} updated!`, ToastAndroid.SHORT);
      setCurrentTask("");
      setIsLoadingToggle(false);
      await fetchTasks();
    } catch (err) {
      console.log("TOGGLE FOCUS ERROR: ", err.response);
    }
  };

  const handleCreateNewTask = async (_title) => {
    try {
      ToastAndroid.show(`Task ${_title} created!`, ToastAndroid.SHORT);
      await fetchTasks();
      return;
    } catch (err) {
      console.log("ERROR CRESATING TASK:", err.response);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <View style={{ flex: 1 }}> */}
      <Header editMode={editMode} />
      <ProgressBar editMode={editMode} progress={progress} />
      {/* </View> */}

      <TaskList
        tasks={tasks}
        editMode={editMode}
        handleToggleTaskFocus={handleToggleTaskFocus}
        handleToggleTaskComplete={handleToggleTaskComplete}
        currentTask={currentTask}
        isLoadingToggle={isLoadingToggle}
      />

      {/* <KeyboardAvoidingView></KeyboardAvoidingView> */}

      <AddItem
        handleCreateNewTask={handleCreateNewTask}
        fetchTasks={fetchTasks}
        editMode={editMode}
      />
    </KeyboardAvoidingView>
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
