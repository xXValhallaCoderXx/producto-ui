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
import { toggleEditMode } from "../today-slice";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
  onToggleFocus,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const theme = useTheme();
  const inputRef = useRef(null);
  const dragRef = useRef(false);
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const addTaskMode = useSelector((state) => state.today.addTaskMode);

  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    // sortData();
    console.log("TASKS ", tasks.length);
    setEditTask(null);
    setData(tasks);
  }, [tasks]);

  const sortData = async () => {
    const hasData = await AsyncStorage.getItem(currentDate);

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
        // const tempArray = [];
        // JSON.parse(hasData).forEach((item) => {
        //   const task = tasks.find((task) => task?.id === item);
        //   if (task) {
        //     tempArray.push(task);
        //   }
        // });

        // console.log("SORTED ", sortedTasks);

        // setData(tempArray.push(...x));
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

    // const getStoredItems = tasksCopy.filter((task) =>
    //   storedItems.includes(task.id)
    // );
    // console.log("GET STORED ITEMS", getStoredItems);
    // console.log("FILTERED STATE: ", tasks);

    // const taskIds = tasks.map((task) => task.id);
    // const localData = data.map((task) => task.id);
    // console.log("CURRENT TASKS: ", taskIds);
    // console.log("LOCAL DATA: ", localData);
    // if (hasData && hasData.length === tasks.length) {
    //   let tempResult = [];
    // JSON.parse(hasData).forEach((item) => {
    //   const task = tasks.find((task) => task?.id === item);
    //   if (task) {
    //     tempResult.push(task);
    //   }
    // });
    //   setData(tempResult);
    // } else {
    //   setData(tasks);
    // }
  };

  const handleOnBlur = async (e) => {
    if (!dragRef.current) {
      e.stopPropagation();
      setEditTask(null);
      setTaskValue("");
      dispatch(toggleEditMode({ editMode: false }));
      await updateTaskApi({
        id: editTask,
        data: {
          title: value,
        },
        date: format(utcDate, "yyyy-MM-dd"),
      });
    }
  };

  const handleOnChange = (_value) => {
    setTaskValue(_value);
  };

  const handleOnCheckTask = (_task) => () => {
    onCheckTask(_task);
  };

  const onPressDelete = (_task) => () => {
    handleOnPressDelete(_task.id);
  };

  const renderItem = ({ item, drag, isActive, index }) => {
    if (item && item?.id === editTask) {
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
                  value={value}
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
                  style={{ fontSize: 25 }}
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
        disabled={addTaskMode || !!editTask}
        titleStyle={{
          color: item?.completed ? "gray" : "black",
          marginLeft: 5,
          textDecorationLine: item?.completed ? "line-through" : "none",
          maxWidth: "90%",
        }}
        onLongPress={() => {
          console.log("ITEM: ", item);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditTask(item?.id);
          setTaskValue(item?.title);
          dispatch(toggleEditMode({ editMode: true }));
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
        // const itemSort = _data.map((item) => item?.id);
        // console.log("ON DRAG END", itemSort);
        // console.log("ON DRAG END: ", itemSort);
        // const objectToStore = JSON.stringify(itemSort);

        // sortData();
        dragRef.current = false;
        setData(_data);
        // await AsyncStorage.setItem(currentDate, objectToStore);
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
