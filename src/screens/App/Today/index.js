import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { format, add, sub } from "date-fns";
import { useTheme } from "@rneui/themed";
import * as NavigationBar from "expo-navigation-bar";
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";
import MoveIncomplete from "./MoveIncomplete";
import IntroBottomSheet from "./IntroBottomSheet";
import SkeletonList from "./components/SkeletonList";
import {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  useMoveIncompleteTasksMutation,
  useGetIncompleteTasksQuery,
} from "../../../api/task-api";
import { api } from "../../../api";
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";
import LayoutView from "../../../components/LayoutView";
import { useToast } from "react-native-toast-notifications";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const focusMode = useSelector((state) => state.today.focusMode);
  const x = useSelector((state) => state.persist);
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
      toValue: focusMode ? 160 : 130,
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

  const handleMoveIncompleteTasks = async () => {
    const from = format(utcDate, "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    await moveIncompleteTasks({ from, to });

    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: `Tasks moved to ${to}!`,
      description: "",
    });
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
    <LayoutView>
      <GestureHandlerRootView style={styles.container}>
        <Header
          clientUtc={utcDate}
          focusMode={focusMode}
          onChangeDate={handleOnChangeDate}
          onPressToday={handleOnPressToday}
          onPressDate={handleOnPressDate}
        />
        <ProgressBar focusMode={focusMode} progress={progress} />

        <View
          contentContainerStyle={{ justifyContent: "space-between", flex: 1 }}
          style={{ flex: 1, marginTop: 10 }}
        >
          <View
            style={{ height: 80, display: "flex", justifyContent: "center" }}
          >
            {isLoading || isFetching ? (
              <View style={{ flex: 1, paddingTop: 20 }}>
                <SkeletonList />
              </View>
            ) : (
              <Animated.View
                style={{ height: 400, transform: [{ translateY: posXanim }] }}
              >
                <KeyboardAvoidingView>
                  <TaskList
                    tasks={tasks || []}
                    handleToggleTaskFocus={handleToggleTaskFocus}
                    handleToggleTaskComplete={handleToggleTaskComplete}
                    currentTask={currentTask}
                    isLoadingToggle={isLoadingToggle}
                    utcDate={utcDate}
                  />

                  <AddItem
                    handleCreateNewTask={handleCreateNewTask}
                    currentDate={utcDate}
                  />
                </KeyboardAvoidingView>
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

          {isFetching || !focusMode ? null : (
            <MoveIncomplete
              tasks={tasks}
              currentDate={utcDate}
              isLoading={moveIncompleteTasksResult.isLoading}
              onMoveIncomplete={handleMoveIncompleteTasks}
            />
          )}
        </View>
        <IntroBottomSheet />
      </GestureHandlerRootView>
    </LayoutView>
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
