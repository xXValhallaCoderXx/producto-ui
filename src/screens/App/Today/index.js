import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { startOfDay, endOfDay } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";

import DraggableFlatList from "react-native-draggable-flatlist";
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { setCurrentDate, selectCurrentDate } from "./today-slice";

import {
  useGetTodaysTasksQuery,
  useCreateTaskMutation,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
} from "../../../api/task-api";
import { toggleCalendar } from "./today-slice";

import { useToast } from "react-native-toast-notifications";
import CalendarWidget from "./components/Calendar";
import MoveIncomplete from "./components/MoveIncomplete";
import MoveIncompleteModal from "../../../components/MoveIncompleteModal";
import Header from "./components/Header";
import AddItem from "./components/AddItem";
import ListItem from "./components/ListItem";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const currentDate = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const [isMoveIncompleteOpen, setIsMoveIncompleteOpen] = useState(false);
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
      // const total = tasks.length;
      // const completed = tasks.filter((task) => task.completed).length;
      // setProgress(Math.round((completed / total) * 100) / 100);
    }
  }, [tasks]);

  const handleToggleCalendar = () => {
    dispatch(toggleCalendar());
  };

  const handleOpenIncompleteModal = () => {
    setIsMoveIncompleteOpen(true);
  };

  const handleCloseIncompleteModal = () => {
    setIsMoveIncompleteOpen(false);
  };

  const handleOnSelectDay = (_day) => {
    dispatch(setCurrentDate(new Date(_day.dateString).toISOString()));
    dispatch(toggleCalendar({ calendarOpen: false }));
  };

  const handleMoveIncompleteTasks = async (items) => {
    const to = new Date().toISOString();
    moveTasksApi({ tasks: Object.keys(items), to });
    setIsMoveIncompleteOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={155}
      style={{ paddingTop: 10, flex: 1, backgroundColor: "white" }}
    >
      <DraggableFlatList
        data={tasks || []}
        stickyHeaderIndices={[0]}
        keyExtractor={(item) => item?.id}
        renderItem={ListItem}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={Header}
        ListFooterComponent={AddItem}
      />

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
    </KeyboardAvoidingView>
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
