import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";
import * as NavigationBar from "expo-navigation-bar";
import DraggableFlatList from "react-native-draggable-flatlist";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";

import { setCurrentDate, selectCurrentDate } from "./today-slice";

import {
  useGetTodaysTasksQuery,
  useGetIncompleteTasksQuery,
  useMoveSpecificTasksMutation,
  useDeleteTaskMutation,
} from "../../../api/task-api";
import {
  toggleCalendar,
  setProgress,
  setDeleteTaskId,
  setEditingTask,
} from "./today-slice";

import { useToast } from "react-native-toast-notifications";
import ConfirmationModal from "../../../components/ConfirmationModal";
import CalendarWidget from "./components/Calendar";
import MoveIncomplete from "./components/MoveIncomplete";
import MoveIncompleteModal from "../../../components/MoveIncompleteModal";
import Header from "./components/Header";
import AddItem from "./components/AddItem";
import ListItem from "./components/ListItem";
import SkeletonList from "./components/SkeletonList";

const ListScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const currentDate = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const deleteTaskId = useSelector((state) => state.today.deleteTaskId);
  const [isMoveIncompleteOpen, setIsMoveIncompleteOpen] = useState(false);
  const { data: incompleteTasks } = useGetIncompleteTasksQuery({});
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();

  const todaysTasks = useGetTodaysTasksQuery({
    start: startOfDay(currentDate).toISOString(),
    end: endOfDay(currentDate).toISOString(),
  });

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
    if (deleteTaskApiResults.isSuccess) {
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Task Deleted!`,
        description: "",
      });
    }
  }, [deleteTaskApiResults]);

  const handleToggleCalendar = () => {
    dispatch(toggleCalendar());
  };

  const handleKeyboardDismiss = (e) => {
    Keyboard.dismiss();
  };

  const handleOnDeleteTask = () => {
    deleteTaskApi({
      id: deleteTaskId,
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
    dispatch(setEditingTask(null));
    dispatch(setDeleteTaskId(null));
  };

  const handleOpenIncompleteModal = () => {
    setIsMoveIncompleteOpen(true);
  };

  const handleCloseIncompleteModal = () => {
    setIsMoveIncompleteOpen(false);
  };

  const handleCloseDeleteModal = () => {
    dispatch(setDeleteTaskId(null));
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

  const processedTasks = useMemo(() => {
    const total = tasks?.length;
    const completed = tasks?.filter((task) => task.completed).length;
    dispatch(setProgress(Math.round((completed / total) * 100) / 100));

    return tasks?.filter((task) => {
      if (focusMode && !task.completed) {
        return task;
      } else if (!focusMode) {
        return task;
      }
      return false;
    });
  }, [tasks, focusMode]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ?? "padding"}
      keyboardVerticalOffset={155}
      style={{
        paddingTop: 10,
        flex: 1,
        backgroundColor: "white",
        alignContent: "space-between",
        justifyContent: "space-between",
      }}
    >
      {isLoading ? (
        <View>
          <Header />
          <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
            <SkeletonList />
          </View>
        </View>
      ) : (
        <DraggableFlatList
          data={processedTasks || []}
          stickyHeaderIndices={[0]}
          bounces={false}
          keyExtractor={(item) => item?.id}
          renderItem={ListItem}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={Header}
          ListFooterComponent={AddItem}
        />
      )}

      <View
        onPress={handleKeyboardDismiss}
        style={styles.moveIncomlpleteContainer}
      >
        <MoveIncomplete
          tasks={tasks}
          currentDate={currentDate}
          isLoading={moveTasksApiResult.isLoading}
          onMoveIncomplete={handleOpenIncompleteModal}
        />
      </View>
      <CalendarWidget
        calendarOpen={calendarOpen}
        toggleCalendar={handleToggleCalendar}
        incompleteTasks={incompleteTasks}
        currentDate={currentDate}
        handleOnSelectDay={handleOnSelectDay}
      />

      <MoveIncompleteModal
        tasks={tasks}
        isVisible={isMoveIncompleteOpen}
        onPress={handleMoveIncompleteTasks}
        onCancel={handleCloseIncompleteModal}
        currentDate={currentDate}
      />
      <ConfirmationModal
        isVisible={Boolean(deleteTaskId)}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        onConfirm={handleOnDeleteTask}
        onCancel={handleCloseDeleteModal}
        confirmLabel="Confirm"
        isLoading={deleteTaskApiResults.isLoading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  moveIncomlpleteContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
});

export default ListScreen;
