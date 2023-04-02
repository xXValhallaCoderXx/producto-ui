import React, { useState, useEffect, useRef } from "react";
import DraggableFlatList, {
  OpacityDecorator,
} from "react-native-draggable-flatlist";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme, Checkbox, List } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IoniIcons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { setEditingTask, selectCurrentDate } from "../today-slice";
import { format, startOfDay, endOfDay } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

function mapOrder(array, order, key) {
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key];

    if (order.indexOf(A) > order.indexOf(B)) {
      return 1;
    } else {
      return -1;
    }
  });

  return array;
}

const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
  onToggleFocus,
}) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const inputRef = useRef(null);
  const dragRef = useRef(false);

  const [data, setData] = useState([]);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const addTaskMode = useSelector((state) => state.today.addTaskMode);
  const editTaskId = useSelector((state) => state.today.editingTask);

  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDateTime = useSelector(selectCurrentDate);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    checkSortedTasksStorage();
  }, [tasks]);

  const checkSortedTasksStorage = async () => {
    const storedTasks = await AsyncStorage.getItem(todayDate);
    if (storedTasks) {
      const orderedArray = mapOrder(tasks, storedTasks, "id");
      setData(orderedArray);
    } else {
      setData(tasks);
    }
  };

  const handleOnBlur = async (e) => {
    if (!dragRef.current) {
      e.stopPropagation();
      updateTaskApi({
        id: editTaskId,
        data: {
          title: editTaskTitle,
        },
        start: startOfDay(currentDateTime).toISOString(),
        end: endOfDay(currentDateTime).toISOString(),
      });
      dispatch(setEditingTask(null));
    }
  };

  const storeSortedTasks = async (_tasks) => {
    const taskIds = _tasks.map((task) => task?.id);
    const objectToStore = JSON.stringify(taskIds);
    await AsyncStorage.setItem(todayDate, objectToStore);
  };

  const handleOnChange = (_value) => {
    setEditTaskTitle(_value);
  };

  const handleOnCheckTask = (_task) => () => {
    onCheckTask(_task);
  };

  const onPressDelete = (_task) => () => {
    handleOnPressDelete(_task.id);
  };

  const renderItem = ({ item, drag, isActive, index }) => {
    if (item?.id === editTaskId) {
      return (
        <OpacityDecorator>
          <List.Item
            key={item?.id}
            style={{
              paddingLeft: !focusMode && currentDate === todayDate ? 20 : 20,
              ...styles.editItem,
            }}
            left={() => (
              <View style={styles.leftContainer}>
                <TouchableOpacity onLongPress={drag}>
                  <MaterialIcons
                    name="drag-indicator"
                    color={"#6B7280"}
                    style={{ fontSize: 35 }}
                  />
                </TouchableOpacity>
                <TextInput
                  onChangeText={handleOnChange}
                  value={editTaskTitle}
                  autoFocus
                  ref={inputRef}
                  onBlur={handleOnBlur}
                  multiline
                  underlineColorAndroid="transparent"
                  style={styles.editTaskInput}
                />
              </View>
            )}
            right={() => (
              <TouchableOpacity onPress={onPressDelete(item)}>
                <FontAwesome
                  name="trash-o"
                  color={"#6B7280"}
                  style={{ fontSize: 25, marginTop: 5 }}
                />
              </TouchableOpacity>
            )}
          ></List.Item>
        </OpacityDecorator>
      );
    }

    return (
      <List.Item
        title={item?.title}
        titleNumberOfLines={4}
        disabled={addTaskMode || !!editTaskId}
        titleStyle={{
          color: item?.completed ? "gray" : "black",
          marginLeft: 5,
          textDecorationLine: item?.completed ? "line-through" : "none",
          maxWidth: "90%",
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditTaskTitle(item?.title);
          dispatch(setEditingTask(item.id));
        }}
        onPress={() => onCheckTask(item)}
        style={{
          paddingRight: 15,
        }}
        right={() => (
          <Checkbox.Android
            status={item?.completed ? "checked" : "unchecked"}
            onPress={handleOnCheckTask(item)}
          />
        )}
        left={() =>
          !focusMode && currentDate === todayDate ? (
            <IoniIcons
              onPress={onToggleFocus(item)}
              style={styles.keyIcon}
              color={item?.focus ? theme.colors.primary : "black"}
              name={"key-outline"}
            />
          ) : null
        }
      />
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragBegin={() => {
        dragRef.current = true;
      }}
      onDragEnd={async ({ data: _data }) => {
        dragRef.current = false;
        storeSortedTasks(_data);
        setData(_data);
      }}
      keyExtractor={(item) => item?.id}
      renderItem={renderItem}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 6,
    height: 52,
  },
  editItem: {
    paddingLeft: 15,
    paddingRight: 25,
    height: 52,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 35,
  },
  editTaskInput: {
    marginLeft: 22,
    marginTop: 3,
    fontSize: 16,
    backgroundColor: "white",
    maxWidth: "80%",
  },
  leftContainer: {
    flexDirection: "row",
  },
  keyIcon: {
    fontSize: 22,
    marginRight: 10,
    marginLeft: 17,
    transform: [{ rotate: "45deg" }],
    alignSelf: "center",
  },
});

export default DraggableListContainer;
