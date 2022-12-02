import { useState, useMemo, useEffect } from "react";
import { format, sub, add } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Tex, Button, TextInput, useTheme } from "react-native-paper";
import { KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import Header from "./components/Header";
import MoveIncomplete from "./components/MoveIncomplete";
import DraggableList from "./components/DraggableList";
import ProgressRow from "./components/ProgressBar";
import AddItem from "./components/AddItem";
import SkeletonList from "./components/SkeletonList";
import DeleteModal from "./components/DeleteModal";
import useKeyboard from "../../shared/hooks/use-keyboard";
import MoveTaskModal from "../../components/MoveTasksModal";
import {
  useGetTodaysTasksQuery,
  useGetIncompleteTasksQuery,
  useCreateTaskMutation,
  useMoveSpecificTasksMutation,
} from "../../api/tasks-api";

import { toggleCalendar } from "../../shared/slice/today-slice";
import {
  useToggleTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../api/tasks-api";
import CalendarWidget from "./components/Calendar";
import { useToast } from "react-native-toast-notifications";
import { api } from "../../api";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [visible] = useKeyboard({ useWillShow: true, useWillHide: true });
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isMoveTaskModalVisible, setIsMoveTaskModalVisible] = useState(null);
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const toast = useToast();
  const [utcDate, setUtcDate] = useState(new Date());
  const [toggleTask, toggleTaskApi] = useToggleTaskMutation();
  const [listHeight, setListHeight] = useState(0);
  const isToday = useSelector((state) => state.today.isToday);
  const calendarOpen = useSelector((state) => state.today.calendarOpen);
  const focusMode = useSelector((state) => state.today).focusMode;
  const { data: incompleteTasks } = useGetIncompleteTasksQuery({});
  const [updateTaskApi] = useUpdateTaskMutation();
  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [deleteTaskApi, deleteTaskApiResults] = useDeleteTaskMutation();
  const {
    data,
    isLoading: tasksIsLoading,
    isFetching: tasksIsFetching,
  } = useGetTodaysTasksQuery({
    date: format(utcDate, "yyyy-MM-dd"),
  });
  useEffect(() => {
    if (deleteTaskApiResults.isSuccess) {
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Task deleted!`,
        description: "",
      });
    }
  }, [deleteTaskApiResults]);

  useEffect(() => {
    if (createTaskResult.isSuccess) {
      toast.show("", {
        type: "success",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Task created!`,
        description: "",
      });
      console.log("LETS GO");
    }
  }, [createTaskResult]);

  useEffect(() => {
    if (moveTasksApiResult.isSuccess) {
      setUtcDate(new Date());
    }
  }, [moveTasksApiResult]);

  // const focusMode = useSelector((state) => state.today.focusMode);

  const handleSubmitAutoTask = async (dates) => {
    const to = format(new Date(), "yyyy-MM-dd");
    await moveTasksApi({ tasks: Object.keys(dates), to });
    setIsMoveTaskModalVisible(false);
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: "Tasks have been moved!",
    });
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

  const toggleComplete = async (_task) => {
    await toggleTask({
      id: _task.id,
      completed: !_task.completed,
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const handleOnPressToday = () => {
    setUtcDate(new Date());
  };

  const handleToggleCalendar = () => {
    dispatch(toggleCalendar());
  };

  const handleOnPressDate = async () => {
    dispatch(toggleCalendar({ calendarOpen: !calendarOpen }));
  };

  const calculatedProgress = useMemo(() => expensiveCalculation(), [data]);

  const handleOnSelectDay = (_day) => {
    setUtcDate(new Date(_day.dateString));
    dispatch(toggleCalendar({ calendarOpen: false }));
  };

  const handleCancelDelete = () => {
    setIsDeleteVisible(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteVisible(false);
    await deleteTaskApi({
      id: taskToDelete,
      date: format(utcDate, "yyyy-MM-dd"),
    });
    setTaskToDelete(null);
  };

  const handleDeleteTask = (task) => {
    setIsDeleteVisible(true);
    setTaskToDelete(task);
  };

  function expensiveCalculation(n) {
    const total = data?.length;
    const completed = data?.filter((task) => task.completed).length;

    return Math.round((completed / total) * 100) / 100 || 0;
  }

  const handleCreateNewTask = async (_title) => {
    await createTask({
      title: _title,
      deadline: format(utcDate, "yyyy-MM-dd"),
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const onMoveIncomplete = () => {
    setIsMoveTaskModalVisible(true);
  };

  const handleCloseTaskModal = () => {
    setIsMoveTaskModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 30,
        paddingBottom: 0,

        backgroundColor: "white",
      }}
    >
      <Header
        clientUtc={utcDate}
        onChangeDate={handleOnChangeDate}
        onPressToday={handleOnPressToday}
        onPressDate={handleOnPressDate}
      />
      <ProgressRow progress={calculatedProgress} />

      <View style={{ flex: 1, marginTop: 20 }}>
        {tasksIsLoading || tasksIsFetching ? (
          <SkeletonList />
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            <View style={{ flex: 8 }}>
              <DraggableList
                updateTaskApi={updateTaskApi}
                handleDelete={handleDeleteTask}
                toggleComplete={toggleComplete}
                focusMode={focusMode}
                tasks={data.filter((task) => {
                  if (!focusMode && !task.focus) {
                    return false;
                  }
                  return task;
                })}
                utcDate={utcDate}
              />
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "flex-end",
                paddingTop: 25,
                paddingBottom: 5,
              }}
            >
              {focusMode && (
                <View style={{ paddingBottom: 10 }}>
                  <AddItem handleCreateNewTask={handleCreateNewTask} />
                </View>
              )}
              {data?.length > 0 &&
                !isToday &&
                !tasksIsLoading &&
                !tasksIsFetching &&
                !visible && (
                  <View style={{ paddingBottom: 20 }}>
                    <MoveIncomplete
                      tasks={data}
                      isLoading={false}
                      currentDate={utcDate}
                      onMoveIncomplete={onMoveIncomplete}
                    />
                  </View>
                )}
            </View>
          </View>
        )}
      </View>
      <CalendarWidget
        calendarOpen={calendarOpen}
        toggleCalendar={handleToggleCalendar}
        incompleteTasks={incompleteTasks || []}
        currentDate={utcDate}
        isToday={isToday}
        handleOnSelectDay={handleOnSelectDay}
      />
      <DeleteModal
        isVisible={isDeleteVisible}
        onPress={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <MoveTaskModal
        isLoading={moveTasksApiResult.isLoading}
        isVisible={isMoveTaskModalVisible}
        onPress={handleSubmitAutoTask}
        onCancel={handleCloseTaskModal}
        date={utcDate}
      />
    </View>
  );
};

export default HomeScreen;
