import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { format, add, sub } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";
import { useHeaderHeight } from "@react-navigation/elements";
import { toggleEditMode } from "./today-slice";
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Header from "./components/Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";
import MoveIncomplete from "./components/MoveIncomplete";
import IntroBottomSheet from "./IntroBottomSheet";
import SkeletonList from "./components/SkeletonList";
import MoveIncompleteModal from "../../../components/MoveIncompleteModal";

import {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  useMoveIncompleteTasksMutation,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
} from "../../../api/task-api";
import { api } from "../../../api";
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";
import { useToast } from "react-native-toast-notifications";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const isToday = useSelector((state) => state.today.isToday);
  const [currentTask, setCurrentTask] = useState(false);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const editMode = useSelector((state) => state.today.editMode);
  const posXanim = useRef(new Animated.Value(0)).current;
  const [utcDate, setUtcDate] = useState(new Date());
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();

  const hehe = useGetTodaysTasksQuery(
    { date: format(utcDate, "yyyy-MM-dd") }
    // { pollingInterval: 5000 }
  );
  const { data: tasks, isLoading, isFetching, error } = hehe;
  const [isMoveIncompleteOpen, setIsMoveIncompleteOpen] = useState(false);
  const [posY] = useState(new Animated.Value(0));
  const {
    data: incompleteTasks,
    isLoading: incompleteIsLoading,
    error: incError,
  } = useGetIncompleteTasksQuery({});
  const height = useHeaderHeight();
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
      toValue: focusMode ? 0 : 50,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [focusMode]);

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
    }
  }, [createTaskResult.isError]);

  const setTheme = async () => {
    Platform.OS === "android" &&
      (await NavigationBar.setBackgroundColorAsync("white"));
    Platform.OS === "android" &&
      (await NavigationBar.setButtonStyleAsync("dark"));
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
    dispatch(toggleEditMode({ editMode: false }));
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
    const res = await createTask({
      title: _title,
      deadline: format(utcDate, "yyyy-MM-dd"),
      date: format(utcDate, "yyyy-MM-dd"),
    });

    dispatch(
      api.util.updateQueryData(
        "getTodaysTasks",
        { date: format(utcDate, "yyyy-MM-dd") },
        (draft) => {
          console.log("WHAT IS RES: ", res);
          const task = draft.find((todo) => todo.title === res.data.title);
          task.id = res.data.id;
          return draft;
        }
      )
    );
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: `Task created!`,
      description: "",
    });
    return;
  };

  const handleMoveIncompleteTasks = async (items) => {
    const to = format(new Date(), "yyyy-MM-dd");
    await moveTasksApi({ tasks: Object.keys(items), to });
    setIsMoveIncompleteOpen(false);
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: "Selected tasks have been moved!",
    });
    // const from = format(utcDate, "yyyy-MM-dd");
    // const to = format(new Date(), "yyyy-MM-dd");
    // await moveIncompleteTasks({ from, to });
    // toast.show("", {
    //   type: "success",
    //   duration: 2500,
    //   offset: 100,
    //   animationType: "zoom-in",
    //   placement: "top",
    //   title: `Tasks moved to ${to}!`,
    //   description: "",
    // });
  };

  const handleOpenIncompleteModal = () => {
    setIsMoveIncompleteOpen(true);
  };

  const handleCloseIncompleteModal = () => {
    setIsMoveIncompleteOpen(false);
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

  const handleKeyboardDismiss = (e) => {
    // e.stopPropagation();
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      onPress={handleKeyboardDismiss}
      accessible={false}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <View style={{ paddingHorizontal: 5 }}>
            <Header
              clientUtc={utcDate}
              focusMode={focusMode}
              onChangeDate={handleOnChangeDate}
              onPressToday={handleOnPressToday}
              onPressDate={handleOnPressDate}
            />
            <ProgressBar focusMode={focusMode} progress={progress} />
          </View>

          {isLoading || isFetching ? (
            <View style={{ marginTop: 15 }}>
              <SkeletonList />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={{ flex: 0.9 }}>
                <View style={{ flex: 0.9, paddingTop: 10 }}>
                  <TaskList
                    tasks={tasks || []}
                    handleToggleTaskFocus={handleToggleTaskFocus}
                    handleToggleTaskComplete={handleToggleTaskComplete}
                    currentTask={currentTask}
                    isLoadingToggle={isLoadingToggle}
                    utcDate={utcDate}
                  />
                  {!editMode && (
                    <View
                      style={{
                        marginTop: 15,
                        paddingLeft: isToday ? 5 : 15,
                      }}
                    >
                      <AddItem
                        handleCreateNewTask={handleCreateNewTask}
                        currentDate={utcDate}
                        focusMode={focusMode}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
          <CalendarWidget
            calendarOpen={calendarOpen}
            toggleCalendar={handleToggleCalendar}
            incompleteTasks={incompleteTasks}
            currentDate={utcDate}
            handleOnSelectDay={handleOnSelectDay}
          />
          <IntroBottomSheet />
        </KeyboardAvoidingView>

        <View style={styles.moveIncomlpleteContainer}>
          <View style={{ paddingBottom: 20 }}>
            <MoveIncomplete
              tasks={tasks}
              currentDate={utcDate}
              isLoading={moveIncompleteTasksResult.isLoading}
              onMoveIncomplete={handleOpenIncompleteModal}
            />
          </View>
        </View>
        <MoveIncompleteModal
          isVisible={isMoveIncompleteOpen}
          onPress={handleMoveIncompleteTasks}
          onCancel={handleCloseIncompleteModal}
          currentDate={utcDate}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  moveIncomlpleteContainer: {
    // flex: 0.15,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
});

export default ListScreen;
