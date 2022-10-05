import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Text } from "@rneui/base";
import { format, add, sub } from "date-fns";
import { useTheme, Skeleton } from "@rneui/themed";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  ToastAndroid,
  ScrollView,
  Animated,
  Platform
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
  useGetIncompleteTasksQuery,
} from "../../../api/task-api";
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";

const ListScreen = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const posXanim = useRef(new Animated.Value(0)).current;
  const [utcDate, setUtcDate] = useState(new Date());

  const {
    data: tasks,
    isLoading,
    isFetching,
    error,
  } = useGetTodaysTasksQuery({ date: format(utcDate, "yyyy-MM-dd") });
  const [posY] = useState(new Animated.Value(0));
  const {
    data: incompleteTasks,
    isLoading: incompleteIsLoading,
    error: incError,
  } = useGetIncompleteTasksQuery({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [toggleTask, toggleTaskApi] = useToggleTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [toggleTaskFocus, toggleFocusResult] = useToggleTaskFocusMutation();
  const [moveIncompleteTasks, moveIncompleteTasksResult] =
    useMoveIncompleteTasksMutation();

  useEffect(() => {
    setTheme();
  }, []);

  useEffect(() => {
    Animated.timing(posXanim, {
      toValue: editMode ? 20 : -20,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [editMode]);

  useEffect(() => {
    if (createTaskResult.isError) {
      ToastAndroid.show(`Error creating task!`, ToastAndroid.SHORT);
    }
  }, [createTaskResult.isError]);

  const setTheme = async () => {
    Platform.OS === "android" && await NavigationBar.setBackgroundColorAsync("white");
    Platform.OS === "android" && await NavigationBar.setButtonStyleAsync("dark");
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
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const handleToggleCalendar = () => {
    dispatch(toggleCalendar());
  };

  const handleOnChangeDate = (direction) => () => {
    if (direction === "back") {
      const subUtcDate = sub(new Date(utcDate), { days: 1 });
      setUtcDate(subUtcDate);
    } else {
      const addUtcDate = add(new Date(utcDate), { days: 1 });
      setUtcDate(addUtcDate);
    }
  };

  const handleToggleTaskFocus = async (_task) => {
    await toggleTaskFocus({
      id: _task.id,
      focus: !_task.focus,
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const handleCreateNewTask = async (_title) => {
    await createTask({
      title: _title,
      deadline: format(utcDate, "yyyy-MM-dd"),
    });
    ToastAndroid.show(`Task ${_title} created!`, ToastAndroid.SHORT);
    return;
  };

  const handleMoveIncompleteTasks = async () => {
    const from = format(utcDate, "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    await moveIncompleteTasks({ from, to });
    ToastAndroid.show(`Tasks moved to ${to}!`, ToastAndroid.SHORT);
  };

  const handleOnPressToday = async () => {
    setUtcDate(new Date());
  };

  const handleOnPressDate = async () => {
    dispatch(toggleCalendar({ calendarOpen: !calendarOpen }));
  };

  const handleOnSelectDay = (_day) => {
    setUtcDate(new Date(_day.dateString));
    dispatch(toggleCalendar({ calendarOpen: false }));
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <Header
        clientUtc={utcDate}
        editMode={editMode}
        onChangeDate={handleOnChangeDate}
        onPressToday={handleOnPressToday}
        onPressDate={handleOnPressDate}
      />
      <ProgressBar editMode={editMode} progress={progress} />
    
      <ScrollView
        contentContainerStyle={{ justifyContent: "space-between", flex: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ height: 80, display: "flex", justifyContent: "center" }}>
          {isLoading || isFetching ? (
            <View>
              <Skeleton
                animation="wave"
                width={180}
                height={20}
                skeletonStyle={{ backgroundColor: theme.colors.primary }}
              />
            </View>
          ) : (
            <Animated.View style={{ transform: [{ translateY: posXanim }] }}>
              <TaskList
                tasks={tasks || []}
                editMode={editMode}
                handleToggleTaskFocus={handleToggleTaskFocus}
                handleToggleTaskComplete={handleToggleTaskComplete}
                currentTask={currentTask}
                isLoadingToggle={isLoadingToggle}
                utcDate={utcDate}
              />

              <AddItem
                handleCreateNewTask={handleCreateNewTask}
                editMode={editMode}
                currentDate={utcDate}
              />
            </Animated.View>
          )}
        </View>

        <CalendarWidget
          calendarOpen={calendarOpen}
          toggleCalendar={handleToggleCalendar}
          incompleteTasks={incompleteTasks}
          currentDate={utcDate}
          handleOnSelectDay={handleOnSelectDay}
        />

        {isFetching || !editMode ? null : (
          <MoveIncomplete
            tasks={tasks}
            currentDate={utcDate}
            isLoading={moveIncompleteTasksResult.isLoading}
            onMoveIncomplete={handleMoveIncompleteTasks}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
  },
});

export default ListScreen;
