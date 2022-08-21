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
  const [visible, setVisible] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    setProgress(Math.round((completed / total) * 100) / 100);
  }, [tasks]);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchTasks = async () => {
    console.log("FETCHING TASKAS");
    try {
      const response = await httpClient.get("/task");
      setTasks(response.data);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  const toggleCategory = async (_task) => {
    try {
      ToastAndroid.show("Updated!", ToastAndroid.SHORT);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  const handleToggleSwitch = (task) => async () => {
    const response = await httpClient.post(`/task/${_task.id}`, {
      ...task,
      completed: !task.completed,
      taskId: task.id,
    });
    console.log("RESPONSE: ", response.data);

    // await fetchTasks();
  };

  const handleToggleFocus = (task) => async () => {
    console.log("go");
    await toggleCategory({
      ...task,
      focus: !task.focus,
      taskId: task.id,
    });
    await fetchTasks();
  };

  // const onSubmitTask = async () => {
  //   try {
  //     const response = await httpClient.post(`/task`, { title: taskTitle });
  //     ToastAndroid.show("Updated!", ToastAndroid.SHORT);
  //     await fetchTasks();
  //     setTaskTitle("");
  //     setVisible(false);
  //   } catch (err) {
  //     console.log("err", err.response);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={{ padding: 30 }}>
        <Header editMode={editMode} />
        <ProgressBar editMode={editMode} progress={progress} />
        <TaskList
          tasks={tasks}
          editMode={editMode}
          handleToggleSwitch={handleToggleSwitch}
          handleToggleFocus={handleToggleFocus}
        />
        <AddItem fetchTasks={fetchTasks} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 15,
  },
});

export default ListScreen;
