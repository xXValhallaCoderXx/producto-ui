import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ToastAndroid } from "react-native";
import httpClient from "../../../api/api-handler";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";

const ListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
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
      const response = await httpClient.get("/task");
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
      await httpClient.patch(`/task/${_task.id}`, {
        focus: !_task.focus,
      });
      ToastAndroid.show(`Task ${_task.title} updated!`, ToastAndroid.SHORT);
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
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header editMode={editMode} />
        <ProgressBar editMode={editMode} progress={progress} />
      </View>
      <View style={{ flex: 6, marginTop: 20 }}>
        <TaskList
          tasks={tasks}
          editMode={editMode}
          handleToggleTaskFocus={handleToggleTaskFocus}
          handleToggleTaskComplete={handleToggleTaskComplete}
        />
      </View>
      <AddItem
        handleCreateNewTask={handleCreateNewTask}
        fetchTasks={fetchTasks}
      />

      <StatusBar style="auto" />
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
