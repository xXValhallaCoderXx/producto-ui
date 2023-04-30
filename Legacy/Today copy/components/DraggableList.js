import React, { useState, useEffect, useRef } from "react";
import { Keyboard, Dimensions } from "react-native";
import DraggableFlatList, {
  OpacityDecorator,
} from "react-native-draggable-flatlist";
import { useKeyboard } from "@react-native-community/hooks";
import KeyboardAwareDraggable from "./KeyboardAwareDraggablelist";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Checkbox, List } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  useUpdateTaskMutation,
  useCreateTaskMutation,
} from "../../../../api/task-api";
import { setEditingTask, selectCurrentDate } from "../today-slice";
import { format, startOfDay, endOfDay } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddItem from "../AddItem";

const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
  height,
}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const keyboard = useKeyboard();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const dragRef = useRef(false);
  const [data, setData] = useState(["sss"]);
  const [createTask, createTaskResult] = useCreateTaskMutation();
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

  useEffect(() => {
    setKeyboardHeight(keyboard.coordinates.end.height);
  }, [keyboard.keyboardShown]);

  const handleCreateNewTask = async (_title) => {
    createTask({
      title: _title,
      deadline: currentDate.toISOString(),
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
  };

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

        if (parsedHasData.length > 0 && tasks.length !== parsedHasData.length) {
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
          setData([...tempArray, ...x]);
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

  const handleScrollPosition = (_index) => () => {
    // const inputPosition = _index * 50; // assume each item is 50 pixels tall
    // console.log("INPUT PSOION: ", inputPosition);
    // const screenHeight = Dimensions.get("window").height; // use window.innerHeight for web or Dimensions.get('window').height for mobile
    // const availableSpace = screenHeight - keyboard.coordinates.end.height;
    // console.log("AVAIL: ", availableSpace);
    // const keyboardSpace = availableSpace - 50; // assume keyboard is 50 pixels tall
    // const newPosition = inputPosition - keyboardSpace;
    // // scroll the list to the correct position
    // console.log("NEW POSITION: ", newPosition);
    // if (newPosition > 0) {
    //   scrollRef.current.scrollToOffset({ offset: newPosition });
    // }
    // scrollRef.current.scrollToIndex({ index: _index, viewPosition: 0.5 });
  };

  console.log("SCREEN: ", Dimensions.get("screen").height);
  // console.log("KEYBOARD HEIGHT: ", keyboard.coordinates.end.height);
  // console.log("KEYBOARD COORDIANTES: ", keyboard.coordinates);
  const renderItem = ({ item, drag, isActive, getIndex }) => {
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
                  onBlur={handleOnBlur}
                  // onFocus={handleScrollPosition(getIndex())}
                  // blurOnSubmit={true}
                  // multiline
                  // numberOfLines={3}
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
        left={() => (
          <View pointerEvents="none" style={{ marginTop: 3, paddingLeft: 5 }}>
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
      />
    );
  };

  return (
    <DraggableFlatList
      data={data}
      ref={scrollRef}
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
      keyExtractor={(item) => item?.id ?? Math.random()}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      ListFooterComponentStyle={{ backgroundColor: "red" }}
      ListFooterComponent={() => {
        return (
          <AddItem
            handleCreateNewTask={handleCreateNewTask}
            currentDate={currentDate}
            focusMode={focusMode}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  editItem: {
    paddingLeft: 15,
    paddingRight: 25,
    minHeight: 60,
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
});

export default DraggableListContainer;
