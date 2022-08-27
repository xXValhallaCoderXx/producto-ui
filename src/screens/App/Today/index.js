import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { format, add, sub } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";
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
import MoveIncomplete from "./MoveIncomplete";
import {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  useMoveIncompleteTasksMutation
} from "../../../api/task-api";

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
  } = useGetTodaysTasksQuery({ date: format(currentDate, "yyyy-MM-dd") });
  const [isDisabled, setIsDisabled] = useState(true);
  const [toggleTask, toggleTaskApi] = useToggleTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [toggleTaskFocus, toggleFocusResult] = useToggleTaskFocusMutation();
  const [moveIncompleteTasks, moveIncompleteTasksResult] = useMoveIncompleteTasksMutation();


  useEffect(() => {
    setTheme();
  }, []);

  const setTheme = async () => {
    await NavigationBar.setBackgroundColorAsync("white");
    await NavigationBar.setButtonStyleAsync("dark");
  };

  useEffect(() => {
    if (tasks) {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.completed).length;
      setProgress(Math.round((completed / total) * 100) / 100);
    }
  }, [tasks]);

  const handleToggleTaskComplete = async (_task) => {
    await toggleTask({
      id: _task.id,
      completed: !_task.completed,
      date: format(currentDate, "yyyy-MM-dd"),
    });
  };

  const handleOnChangeDate = (direction) => () => {
    if (direction === "back") {
      const subDate = sub(currentDate, { days: 1 });
      console.log("SUB ", subDate)
      setCurrentDate(subDate);
    } else {
      const addDate = add(currentDate, { days: 1 });
      console.log("addd: ", addDate);
      setCurrentDate(addDate);
    }
  };

  const handleToggleTaskFocus = async (_task) => {
    console.log("TASK , ", _task);
    await toggleTaskFocus({
      id: _task.id,
      focus: !_task.focus,
      data: format(currentDate, "yyyy-MM-dd"),
    });
  };

  const handleCreateNewTask = async (_title) => {
    try {
      await createTask({ title: _title });
      ToastAndroid.show(`Task ${_title} created!`, ToastAndroid.SHORT);
      return;
    } catch (err) {
      console.log("ERROR CRESATING TASK:", err.response);
    }
  };

  const handleMoveIncompleteTasks = async () => {
    await moveIncompleteTasks({date: format(currentDate, "yyyy-MM-dd")})
    const todayDate = format(new Date(), "yyyy-MM-dd");
    ToastAndroid.show(`Tasks moved to ${todayDate}!`, ToastAndroid.SHORT);
  }

  const handleOnPressToday = async () => {
    console.log("LEGGO")
    setCurrentDate(new Date());
  }

  return (
    <View style={styles.container}>
      <Header
        currentDate={currentDate}
        editMode={editMode}
        onChangeDate={handleOnChangeDate}
        onPressToday={handleOnPressToday}
      />
      <ProgressBar editMode={editMode} progress={progress} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <TaskList
          tasks={tasks || []}
          editMode={editMode}
          handleToggleTaskFocus={handleToggleTaskFocus}
          handleToggleTaskComplete={handleToggleTaskComplete}
          currentTask={currentTask}
          isLoadingToggle={isLoadingToggle}
        />

        <AddItem
          handleCreateNewTask={handleCreateNewTask}
          fetchTasks={() => console.log("add")}
          editMode={editMode}
        />
        <MoveIncomplete
          tasks={tasks}
          currentDate={currentDate}
          isLoading={moveIncompleteTasksResult.isLoading}
          onMoveIncomplete={handleMoveIncompleteTasks}
        />
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
