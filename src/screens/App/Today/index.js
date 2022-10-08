import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { format, add, sub } from "date-fns";
import { useTheme, Skeleton } from "@rneui/themed";
import * as NavigationBar from "expo-navigation-bar";
import {
  StyleSheet,
  View,
  ToastAndroid,
  ScrollView,
  Animated,
  Platform,
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
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";
import LayoutView from "../../../components/LayoutView";

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
      toValue: editMode ? 160 : 130,
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
    <LayoutView>
      <GestureHandlerRootView style={styles.container}>
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
          <View
            style={{ height: 80, display: "flex", justifyContent: "center" }}
          >
            {isLoading || isFetching ? (
              <View style={{flex: 1, paddingTop: 20}}>
                <SkeletonList />
                {/* <Skeleton
                  animation="wave"
                  width={180}
                  height={20}
                  skeletonStyle={{ backgroundColor: theme.colors.primary }}
                /> */}
              </View>
            ) : (
              <Animated.View
                style={{ height: 400, transform: [{ translateY: posXanim }] }}
              >
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
