import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { format, add, sub } from "date-fns";
import {
  StyleSheet,
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";
import {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
} from "../../../api/task-api";

const date = new Date();

const ListScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTodaysTasksQuery(format(currentDate, "yyyy-MM-dd"));
  const [
    toggleTask,
    {
      isError: isToggleError,
      isSuccess: isToggleSuccess,
      isLoading: isToggleLoading,
      data: toggleData,
    },
  ] = useToggleTaskMutation();

  useEffect(() => {
    if (tasks) {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.completed).length;
      setProgress(Math.round((completed / total) * 100) / 100);
    }
  }, [tasks]);
  console.log("TASKS", tasks);
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
    console.log("LEGGO", !_task.completed);
    console.log("LEGGO", _task);
    // await toggleTask(_task.id, !_task.completed)
  };

  const handleOnChangeDate = (direction) => () => {
    if (direction === "back") {
      const subDate = sub(currentDate, { days: 1 });
      console.log("sub tract: ", subDate);
      setCurrentDate(subDate);
    } else {
      const addDate = add(currentDate, { days: 1 });
      console.log("addd: ", addDate);
      setCurrentDate(addDate);
    }
  };

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
      <Header editMode={editMode} onChangeDate={handleOnChangeDate} />
      <ProgressBar
        currentDate={currentDate}
        editMode={editMode}
        progress={progress}
      />
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
