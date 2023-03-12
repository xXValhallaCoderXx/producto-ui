import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { format, add, sub } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";
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
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
} from "../../../api/task-api";
import { api } from "../../../api";
import { toggleCalendar } from "./today-slice";
import { useGetProfileQuery } from "../../../api/user-api";
import CalendarWidget from "./Calendar";
import { useToast } from "react-native-toast-notifications";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const editMode = useSelector((state) => state.today.editMode);
  const posXanim = useRef(new Animated.Value(0)).current;
  const [utcDate, setUtcDate] = useState(new Date());
  const isToday = useSelector((state) => state.today.isToday);
  const [updateTask] = useUpdateTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const { data: incompleteTasks } = useGetIncompleteTasksQuery({});
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const todaysTasks = useGetTodaysTasksQuery({
    date: format(utcDate, "yyyy-MM-dd"),
  });

  const { data: tasks, isLoading, isFetching, error } = todaysTasks;

  const [isMoveIncompleteOpen, setIsMoveIncompleteOpen] = useState(false);

  const { data: userData, isLoading: userProfileLoading } =
    useGetProfileQuery();

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
      // TODO - Test removing task from cache
    }
  }, [createTaskResult.isError]);

  useEffect(() => {
    if (createTaskResult.isSuccess) {
      const { data } = createTaskResult;
      toast.show("", {
        type: "success",
        placement: "top",
        title: `Task created!`,
      });
      dispatch(
        api.util.updateQueryData(
          "getTodaysTasks",
          { date: format(utcDate, "yyyy-MM-dd") },
          (draft) => {
            const task = draft.find((todo) => todo.title === data.title);
            task.id = data.id;
            return draft;
          }
        )
      );
    }
  }, [createTaskResult.isSuccess]);

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

  // NEW
  const handleCreateNewTask = async (_title) => {
    createTask({
      title: _title,
      deadline: format(utcDate, "yyyy-MM-dd"),
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const handleToggleTaskComplete = async (_task) => {
    await updateTask({
      id: _task.id,
      data: {
        completed: !_task.completed,
      },
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const handleToggleTaskFocus = async (_task) => {
    await updateTask({
      id: _task.id,
      data: {
        focus: !_task.focus,
      },
      date: format(utcDate, "yyyy-MM-dd"),
    });
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
  };

  return (
    <TouchableWithoutFeedback
      onPress={handleKeyboardDismiss}
      accessible={false}
    >
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "ios" ? 155 : -110}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 0,
            paddingTop: 10,
          }}
        >
          <View style={{ paddingHorizontal: 20 }}>
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
            <View style={{ marginTop: 15, paddingLeft: 20, paddingRight: 10 }}>
              <SkeletonList />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={{ flex: isToday ? 0.96 : 0.94 }}>
                <View style={{ flex: isToday ? 0.94 : 0.94, paddingTop: 10 }}>
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
        </KeyboardAvoidingView>

        <View style={styles.moveIncomlpleteContainer}>
          <View style={{ paddingBottom: 20 }}>
            <MoveIncomplete
              tasks={tasks}
              currentDate={utcDate}
              isLoading={moveTasksApiResult.isLoading}
              onMoveIncomplete={handleOpenIncompleteModal}
            />
          </View>
        </View>
        <MoveIncompleteModal
          tasks={tasks}
          isVisible={isMoveIncompleteOpen}
          onPress={handleMoveIncompleteTasks}
          onCancel={handleCloseIncompleteModal}
          currentDate={utcDate}
        />
        <IntroBottomSheet
          user={userData?.email}
          isLoading={userProfileLoading}
        />
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  moveIncomlpleteContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
  },
});

export default ListScreen;
