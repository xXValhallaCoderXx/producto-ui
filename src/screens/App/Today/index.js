import { useSelector, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState, useRef } from "react";
import { format, add, sub } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";
import { View, Animated, Platform } from "react-native";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";
import AddItem from "./AddItem";
import MoveIncomplete from "./MoveIncomplete";
import MoveIncompletModal from "./components/MoveIncompleteModal";
import IntroBottomSheet from "./IntroBottomSheet";
import SkeletonList from "./components/SkeletonList";
import { useKeyboard } from "../../../shared/hooks/use-keyboard";
// import KeyboardShiftView from "../../../Layouts/components/KeyboardAvoidLayout";
import {
  useGetTodaysTasksQuery,
  useToggleTaskMutation,
  useCreateTaskMutation,
  useToggleTaskFocusMutation,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
} from "../../../api/task-api";
import { api } from "../../../api";
import { toggleCalendar } from "./today-slice";
import CalendarWidget from "./Calendar";
import KeyboardDismissView from "../../../components/Layouts/KeyboardDismissView";
import { useToast } from "react-native-toast-notifications";

const ListScreen = () => {
  const { keyboardShown, keyboardHeight } = useKeyboard();

  const dispatch = useDispatch();
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const [isAutoCompleteModalOpen, setIsAutoCompleteModalOpen] = useState(false);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const isToday = useSelector((state) => state.today.isToday);
  const [utcDate, setUtcDate] = useState(new Date());

  const {
    data: tasks,
    isLoading,
    isFetching,
    error,
  } = useGetTodaysTasksQuery({ date: format(utcDate, "yyyy-MM-dd") });

  const {
    data: incompleteTasks,
    isLoading: incompleteIsLoading,
    error: incError,
  } = useGetIncompleteTasksQuery({});

  const [toggleTask, toggleTaskApi] = useToggleTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [toggleTaskFocus, toggleFocusResult] = useToggleTaskFocusMutation();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const posXanim = useRef(new Animated.Value(0)).current;
  const headerPostXAnim = useRef(new Animated.Value(0)).current;

  const [imageScaleAnim] = useState(new Animated.Value(4.5));

  useEffect(() => {
    Animated.timing(imageScaleAnim, {
      toValue: 240,
      duration: 3000,
      useNativeDriver: true,
    }).start();

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
    Animated.timing(headerPostXAnim, {
      toValue: keyboardShown ? -70 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [keyboardShown]);

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
    setIsAutoCompleteModalOpen(true);
  };

  const handleOnConfirmMove = async (checkedDates) => {
    const to = format(new Date(), "yyyy-MM-dd");
    await moveTasksApi({ tasks: Object.keys(checkedDates), to });

    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: `Tasks moved to ${to}!`,
      description: "",
    });

    setIsAutoCompleteModalOpen(false);
    setUtcDate(new Date());
  };

  const handleOnPressToday = async () => {
    setUtcDate(new Date());
  };

  const handleCloseModal = async () => {
    setIsAutoCompleteModalOpen(false);
  };

  const handleOnPressDate = async () => {
    dispatch(toggleCalendar({ calendarOpen: !calendarOpen }));
  };

  const handleOnSelectDay = (_day) => {
    setUtcDate(new Date(_day.dateString));
    dispatch(toggleCalendar({ calendarOpen: false }));
  };

  return (
    <KeyboardDismissView>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexGrow: 1,
            padding: 30,
            backgroundColor: "white",
          }}
        >
          <Header
            clientUtc={utcDate}
            focusMode={focusMode}
            onChangeDate={handleOnChangeDate}
            onPressToday={handleOnPressToday}
            onPressDate={handleOnPressDate}
          />
          <View style={{ height: 20, marginTop: 10, marginBottom: 20 }}>
            <ProgressBar focusMode={focusMode} progress={progress} />
          </View>
       
            {isLoading || isFetching ? (
              <SkeletonList />
            ) : (
              <>
                <TaskList
                  tasks={tasks || []}
                  keyboardShown={keyboardShown}
                  keyboardHeight={keyboardHeight}
                  handleToggleTaskFocus={handleToggleTaskFocus}
                  handleToggleTaskComplete={handleToggleTaskComplete}
                  handleCreateNewTask={handleCreateNewTask}
                  currentTask={currentTask}
                  isLoadingToggle={isLoadingToggle}
                  utcDate={utcDate}
                />
              
              </>
            )}
        
        </View>
        <MoveIncomplete
          tasks={tasks}
          currentDate={utcDate}
          isLoading={moveTasksApiResult.isLoading}
          onMoveIncomplete={handleMoveIncompleteTasks}
        />

        {isLoading || isFetching ? null : (
          <CalendarWidget
            calendarOpen={calendarOpen}
            toggleCalendar={handleToggleCalendar}
            incompleteTasks={incompleteTasks}
            currentDate={utcDate}
            handleOnSelectDay={handleOnSelectDay}
          />
        )}
        <MoveIncompletModal
          isVisible={isAutoCompleteModalOpen}
          onCancel={handleCloseModal}
          data={tasks}
          onConfirm={handleOnConfirmMove}
          isLoading={moveTasksApiResult.isLoading}
        />

        {/* <IntroBottomSheet /> */}
      </View>
    </KeyboardDismissView>
  );
};

export default ListScreen;
