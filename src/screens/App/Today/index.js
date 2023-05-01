import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { startOfDay, endOfDay, isBefore, isSameDay } from "date-fns";
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
  const previousArgs = useRef(null);
  const currentDate = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);
  const addTaskMode = useSelector((state) => state.today.addTaskMode);
  const editTaskMode = useSelector((state) => state.today.editingTask);
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

  const { data: tasks, isLoading, isFetching, originalArgs } = todaysTasks;

  useEffect(() => {
    dispatch(setCurrentDate(new Date().toISOString()));
  }, []);

  useEffect(() => {
    const total = tasks?.length;
    const completed = tasks?.filter((task) => task.completed).length;
    dispatch(setProgress(Math.round((completed / total) * 100) / 100));
    previousArgs.current = originalArgs;
  }, [tasks]);

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
    const filteredTasks = tasks?.filter((task) => {
      if (focusMode && !task.completed) {
        return task;
      } else if (!focusMode) {
        return task;
      }
      return false;
    });

    return filteredTasks;
  }, [tasks, focusMode]);

  const isSame = originalArgs === previousArgs.current;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : ""}
      keyboardVerticalOffset={155}
      style={styles.keyboardContainer}
    >
      {(isLoading || isFetching) && !isSame ? (
        <View>
          <Header />
          <View style={styles.skeletonContainer}>
            <SkeletonList />
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,

            justifyContent: "space-between",
          }}
        >
          <DraggableFlatList
            data={processedTasks || []}
            stickyHeaderIndices={[0]}
            bounces={false}
            keyExtractor={(item) => item?.id}
            renderItem={ListItem}
            keyboardDismissMode="none"
            style={{
              height:
                isSameDay(new Date(), currentDate) ||
                isBefore(new Date(), currentDate)
                  ? "100%"
                  : "90%",
            }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={Header}
            ListFooterComponent={AddItem}
          />
          <View
            style={{
              paddingBottom: 20,
              paddingTop: 10,
            }}
          >
            <MoveIncomplete
              tasks={tasks}
              currentDate={currentDate}
              isLoading={moveTasksApiResult.isLoading}
              onMoveIncomplete={handleOpenIncompleteModal}
            />
          </View>
        </View>
      )}

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
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  skeletonContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export default ListScreen;
