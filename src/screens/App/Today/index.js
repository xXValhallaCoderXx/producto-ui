import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { add, sub, startOfDay, endOfDay } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";

import { StyleSheet, View, Animated, Platform } from "react-native";
import Header from "./components/Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import MoveIncomplete from "./components/MoveIncomplete";
import SkeletonList from "./components/SkeletonList";
import MoveIncompleteModal from "../../../components/MoveIncompleteModal";
import {
  selectIsToday,
  setCurrentDate,
  setEditingTask,
  selectCurrentDate,
} from "./today-slice";

import {
  useGetTodaysTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
} from "../../../api/task-api";
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";
import { useToast } from "react-native-toast-notifications";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const currentDate = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);

  const [progress, setProgress] = useState(0);
  const [isMoveIncompleteOpen, setIsMoveIncompleteOpen] = useState(false);

  const [updateTask] = useUpdateTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const { data: incompleteTasks } = useGetIncompleteTasksQuery({});
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();

  const todaysTasks = useGetTodaysTasksQuery({
    start: startOfDay(currentDate).toISOString(),
    end: endOfDay(currentDate).toISOString(),
  });

  const posXanim = useRef(new Animated.Value(0)).current;

  const { data: tasks, isLoading } = todaysTasks;

  useEffect(() => {
    setTheme();
    dispatch(setCurrentDate(new Date().toISOString()));
  }, []);

  const setTheme = async () => {
    Platform.OS === "android" &&
      (await NavigationBar.setBackgroundColorAsync("white"));
    Platform.OS === "android" &&
      (await NavigationBar.setButtonStyleAsync("dark"));
  };

  useEffect(() => {
    Animated.timing(posXanim, {
      toValue: focusMode ? 0 : 50,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [focusMode]);

  useEffect(() => {
    if (moveTasksApiResult.isSuccess) {
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: "Selected tasks have been moved!",
      });
    }
  }, [moveTasksApiResult.isSuccess]);

  useEffect(() => {
    if (createTaskResult.isError) {
      toast.show("", {
        type: "error",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Error creating task!`,
        description: "",
      });
      // TODO - Test removing task from cache
    }
  }, [createTaskResult.isError]);

  useEffect(() => {
    if (createTaskResult.isSuccess) {
      toast.show("", {
        type: "success",
        placement: "top",
        title: `Task created!`,
      });
    }
  }, [createTaskResult.isSuccess]);

  useEffect(() => {
    if (tasks) {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.completed).length;
      setProgress(Math.round((completed / total) * 100) / 100);
    }
  }, [tasks]);

  const handleToggleCalendar = () => {
    dispatch(toggleCalendar());
  };

  const handleOnChangeDate = (direction) => () => {
    dispatch(setEditingTask(null));
    if (direction === "back") {
      const subUtcDate = sub(currentDate, { days: 1 });
      dispatch(setCurrentDate(subUtcDate.toISOString()));
    } else {
      const addUtcDate = add(new Date(currentDate), { days: 1 });
      dispatch(setCurrentDate(addUtcDate.toISOString()));
    }
  };

  const handleOpenIncompleteModal = () => {
    setIsMoveIncompleteOpen(true);
  };

  const handleCloseIncompleteModal = () => {
    setIsMoveIncompleteOpen(false);
  };

  const handleOnPressToday = async () => {
    dispatch(setCurrentDate(new Date().toISOString()));
  };

  const handleOnPressDate = async () => {
    dispatch(toggleCalendar({ calendarOpen: !calendarOpen }));
  };

  const handleOnSelectDay = (_day) => {
    dispatch(setCurrentDate(new Date(_day.dateString).toISOString()));
    dispatch(toggleCalendar({ calendarOpen: false }));
  };

  // const handleKeyboardDismiss = (e) => {
  //   // e.stopPropagation();
  //   Keyboard.dismiss();
  // };

  // NEW
  // const handleCreateNewTask = async (_title) => {
  //   createTask({
  //     title: _title,
  //     deadline: currentDate.toISOString(),
  //     start: startOfDay(currentDate).toISOString(),
  //     end: endOfDay(currentDate).toISOString(),
  //   });
  // };

  const handleToggleTaskComplete = async (_task) => {
    await updateTask({
      id: _task.id,
      data: {
        completed: !_task.completed,
      },
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
  };

  const handleToggleTaskFocus = async (_task) => {
    await updateTask({
      id: _task.id,
      data: {
        focus: !_task.focus,
      },
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
  };

  const handleMoveIncompleteTasks = async (items) => {
    const to = new Date().toISOString();
    moveTasksApi({ tasks: Object.keys(items), to });
    setIsMoveIncompleteOpen(false);
  };

  return (
    <GestureHandlerRootView
      style={{ paddingTop: 10, flex: 1, backgroundColor: "white" }}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Header
          clientUtc={currentDate}
          focusMode={focusMode}
          onChangeDate={handleOnChangeDate}
          onPressToday={handleOnPressToday}
          onPressDate={handleOnPressDate}
        />
        <ProgressBar focusMode={focusMode} progress={progress} />
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonList />
        </View>
      ) : (
        <TaskList
          tasks={tasks || []}
          handleToggleTaskFocus={handleToggleTaskFocus}
          handleToggleTaskComplete={handleToggleTaskComplete}
          utcDate={currentDate}
        />
      )}
      <CalendarWidget
        calendarOpen={calendarOpen}
        toggleCalendar={handleToggleCalendar}
        incompleteTasks={incompleteTasks}
        currentDate={currentDate}
        handleOnSelectDay={handleOnSelectDay}
      />

      <View style={styles.moveIncomlpleteContainer}>
        <MoveIncomplete
          tasks={tasks}
          currentDate={currentDate}
          isLoading={moveTasksApiResult.isLoading}
          onMoveIncomplete={handleOpenIncompleteModal}
        />
      </View>
      <MoveIncompleteModal
        tasks={tasks}
        isVisible={isMoveIncompleteOpen}
        onPress={handleMoveIncompleteTasks}
        onCancel={handleCloseIncompleteModal}
        currentDate={currentDate}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  moveIncomlpleteContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default ListScreen;
