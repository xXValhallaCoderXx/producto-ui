import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { format, add, sub, endOfDay, formatISO } from "date-fns";
import * as Localization from "expo-localization";
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
  useMoveIncompleteTasksMutation,
} from "../../../api/task-api";
import { convertUTCDateToLocalDate } from "../../../shared/utils/date-utils";
import {
  setCurrentDate as setCurrentDateStore,
  toggleCalendar,
} from "./today-slice";
import CalendarWidget from "./Calendar";

const ListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);

  const [utcDate, setUtcDate] = useState(new Date());
  const [clientUtc, setClientUtc] = useState(null);
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTodaysTasksQuery({ date: format(new Date(utcDate), "yyyy-MM-dd") });
  const [isDisabled, setIsDisabled] = useState(true);
  const [toggleTask, toggleTaskApi] = useToggleTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [toggleTaskFocus, toggleFocusResult] = useToggleTaskFocusMutation();
  const [moveIncompleteTasks, moveIncompleteTasksResult] =
    useMoveIncompleteTasksMutation();

  console.log("UTC: ", format(new Date(utcDate), "yyyy-MM-dd"));
  console.log("UTC: ", utcDate);
  useEffect(() => {
    if (utcDate) {
      setClientUtc(formatISO(utcDate));
    }
  }, [utcDate]);

  useEffect(() => {
    // dispatch(setCurrentDateStore({date: new Date().toString()}))

    setTheme();
  }, []);

  useEffect(() => {
    if (createTaskResult.isError) {
      ToastAndroid.show(`Error creating task!`, ToastAndroid.SHORT);
    }
  }, [createTaskResult.isError]);

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

  const handleToggleCalendar = () => {
    console.log("LALAL")
    dispatch(toggleCalendar());
  };

  const handleOnChangeDate = (direction) => () => {
    if (direction === "back") {
      const subUtcDate = sub(new Date(utcDate), { days: 1 });
      const subLocalDate = sub(new Date(clientUtc), { days: 1 });
      setUtcDate(subUtcDate);
      setClientUtc(subLocalDate);
    } else {
      const addUtcDate = add(new Date(utcDate), { days: 1 });
      const addLocalDate = add(new Date(clientUtc), { days: 1 });
      setUtcDate(addUtcDate);
      setClientUtc(addLocalDate);
    }
  };

  const handleToggleTaskFocus = async (_task) => {
    await toggleTaskFocus({
      id: _task.id,
      focus: !_task.focus,
      // date: format(currentDate, "yyyy-MM-dd"),
    });
  };

  const handleCreateNewTask = async (_title) => {
    await createTask({ title: _title, deadline: utcDate });
    ToastAndroid.show(`Task ${_title} created!`, ToastAndroid.SHORT);
    return;
  };

  const handleMoveIncompleteTasks = async () => {
    console.log(endOfDay(currentDate));
    // console.log("whahah", format(currentDate, "yyyy-MM-dd"));
    // await moveIncompleteTasks({date: format(currentDate, "yyyy-MM-dd")})
    // const todayDate = format(new Date(), "yyyy-MM-dd");
    // ToastAndroid.show(`Tasks moved to ${todayDate}!`, ToastAndroid.SHORT);
  };

  const handleOnPressToday = async () => {
    console.log("LEGGO");
    dispatch(toggleCalendar({calendarOpen: !calendarOpen}))
    // setCurrentDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Header
        clientUtc={clientUtc}
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
          editMode={editMode}
          currentDate={utcDate}
        />
   
      <CalendarWidget
          calendarOpen={calendarOpen}
          toggleCalendar={handleToggleCalendar}
        />
     
        {/*
        <MoveIncomplete
          tasks={tasks}
          currentDate={utcDate}
          isLoading={moveIncompleteTasksResult.isLoading}
          onMoveIncomplete={handleMoveIncompleteTasks}
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
