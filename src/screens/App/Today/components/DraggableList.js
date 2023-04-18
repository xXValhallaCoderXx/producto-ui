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
  const userEmail = useSelector((state) => state.global.email);
  const [localIsChecked, setLocalIsChecked] = useState({ id: "" });
  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDateTime = useSelector(selectCurrentDate);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    sortData();
  }, [tasks]);

  const sortData = async () => {
    try {
      const hasData = await AsyncStorage.getItem(`${currentDate}-${userEmail}`);
      const parsedHasData = JSON.parse(hasData);
      if (parsedHasData) {
        function removeValue(_task, index, arr) {
          // If the value at the current array index matches the specified value (2)
          if (parsedHasData.includes(_task.id)) {
            // Removes the value from the original array
            arr.splice(index, 1);
            return true;
          }
          return false;
        }
        if (hasData && parsedHasData.length !== tasks.length) {
          // If new task has been added
          const tasksCopy = [...tasks];
          const tempArray = [];
          parsedHasData.forEach((item) => {
            const task = tasks.find((task) => task?.id === item);
            if (task) {
              tempArray.push(task);
            }
          });

          const x = tasksCopy.filter(removeValue);
          setData(tempArray.push(...x));
        } else {
          const tempArray = [];
          JSON.parse(hasData).forEach((item) => {
            const task = tasks.find((task) => task?.id === item);
            if (task) {
              tempArray.push(task);
            }
          });
          setData(tempArray);
        }
      } else {
        setData(tasks);
      }
    } catch {
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

  const handleOnChange = (_value) => {
    setEditTaskTitle(_value);
  };

  const handleOnCheckTask = (_task) => () => {
    // onCheckTask(_task);
    if (focusMode) {
      setLocalIsChecked({ id: _task.id });
      setTimeout(() => {
        onCheckTask(_task);
      }, 300);
    } else {
      if (!_task.id) {
        setLocalIsChecked({ id: _task.id });
      }
      setLocalIsChecked({ id: "" });
      onCheckTask(_task);
    }
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
                <TouchableOpacity style={{ marginTop: 5 }} onLongPress={drag}>
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
              <View style={{ justifyContent: "center" }}>
                <TouchableOpacity onPress={onPressDelete(item)}>
                  <FontAwesome
                    name="trash-o"
                    color={"#6B7280"}
                    style={{ fontSize: 20, marginTop: 5 }}
                  />
                </TouchableOpacity>
              </View>
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
          color:
            item?.completed || localIsChecked.id === item.id ? "gray" : "black",
          marginLeft: 5,
          textDecorationLine:
            item?.completed || localIsChecked.id === item.id
              ? "line-through"
              : "none",
          maxWidth: "90%",
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditTaskTitle(item?.title);
          dispatch(setEditingTask(item.id));
        }}
        onPress={() => {
          if (focusMode) {
            setLocalIsChecked({ id: item.id });
            setTimeout(() => {
              onCheckTask(item);
            }, 300);
          } else {
            if (!item.id) {
              setLocalIsChecked({ id: item.id });
            }
            setLocalIsChecked({ id: "" });
            onCheckTask(item);
          }
        }}
        style={{
          paddingRight: 15,
          minHeight: 60,
        }}
        right={() => (
          <View style={{ marginTop: 3 }}>
            <Checkbox.Android
              status={
                item?.completed || localIsChecked.id === item.id
                  ? "checked"
                  : "unchecked"
              }
              onPress={handleOnCheckTask(item)}
            />
          </View>
        )}
        // left={() =>
        //   !focusMode && currentDate === todayDate ? (
        //     <IoniIcons
        //       onPress={onToggleFocus(item)}
        //       style={styles.keyIcon}
        //       color={item?.focus ? theme.colors.primary : "black"}
        //       name={"key-outline"}
        //     />
        //   ) : null
        // }
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
        const itemSort = _data.map((item) => item.id);
        const objectToStore = JSON.stringify(itemSort);
        await AsyncStorage.setItem(
          `${currentDate}-${userEmail}`,
          objectToStore
        );
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
  },
  editItem: {
    paddingLeft: 15,
    paddingRight: 25,
    minHeight: 60,
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
