import React, { useState, useEffect } from "react";
import DraggableFlatList, {
  ScaleDecorator,
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
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const addTaskMode = useSelector((state) => state.today.addTaskMode);

  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    sortData();
  }, [tasks]);

  const sortData = async () => {
    const hasData = await AsyncStorage.getItem(currentDate);
    console.log("HAS DATA: ", hasData);
    if (hasData && hasData.length === tasks.length) {
      let tempResult = [];
      JSON.parse(hasData).forEach((item) => {
        const task = tasks.find((task) => task?.id === item);
        if (task) {
          tempResult.push(task);
        }
      });
      setData(tempResult);
    } else {
      setData(tasks);
    }
  };

  const handleOnBlur = async (e) => {
    e.stopPropagation();
    setEditTask(null);
    setTaskValue("");
    dispatch(toggleEditMode({ editMode: false }));
    await updateTaskApi({
      id: editTask,
      title: value,
      date: format(utcDate, "yyyy-MM-dd"),
    });
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

  const renderItem = ({ item, drag, isActive }) => {
    if (item && item?.id === editTask) {
      return (
        <ScaleDecorator>
          <List.Item
            key={item?.id}
            style={{
              paddingLeft: focusMode && currentDate === todayDate ? 25 : 15,
              paddingRight: 15,
              ...styles.editItem,
              // backgroundColor: "red",
            }}
            left={() => (
              <TextInput
                onChangeText={handleOnChange}
                value={value}
                onBlur={handleOnBlur}
                underlineColorAndroid="transparent"
                style={{
                  fontSize: 16,
                  backgroundColor: "white",
                }}
              />
            )}
            right={() => (
              <View
                style={{
                  justifyContent: "flex-end",
                  ...styles.listRow,
                  marginRight: 5,
                  height: 35,
                }}
              >
                <TouchableOpacity
                  onPress={onPressDelete(item)}
                  style={{ marginRight: 15 }}
                >
                  <FontAwesome
                    name="trash-o"
                    color={"#6B7280"}
                    style={{ fontSize: 25 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={drag}>
                  <MaterialIcons
                    name="drag-indicator"
                    color={"#6B7280"}
                    style={{ fontSize: 25 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          ></List.Item>
        </ScaleDecorator>
      );
    }
    return (
      <List.Item
        title={item?.title}
        disabled={addTaskMode}
        titleStyle={{
          color: item?.completed ? "gray" : "black",
          // marginLeft: !focusMode ? -10 : 0,
          textDecorationLine: item?.completed ? "line-through" : "none",
        }}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditTask(item?.id);
          setTaskValue(item?.title);
          dispatch(toggleEditMode({ editMode: true }));
        }}
        onPress={() => onCheckTask(item)}
        style={{
          borderBottomColor: "white",
          // backgroundColor: "red",
          paddingLeft: !focusMode ? 15 : 25,
          paddingRight: 15,
          borderBottomWidth: 1,
          // marginLeft: -5,
        }}
        right={() => (
          <Checkbox.Android
            status={item?.completed ? "checked" : "unchecked"}
            onPress={handleOnCheckTask(item)}
          />
        )}
        left={() =>
          focusMode && currentDate === todayDate ? (
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <IoniIcons
                onPress={onToggleFocus(item)}
                style={{
                  fontSize: 22,
                  marginRight: 10,

                  transform: [{ rotate: "45deg" }],
                }}
                color={item?.focus ? theme.colors.primary : "black"}
                name={"key-outline"}
              />
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={async ({ data }) => {
        const itemSort = data.map((item) => item?.id);

        const objectToStore = JSON.stringify(itemSort);
        AsyncStorage.setItem(currentDate, objectToStore);
        setData(data);
      }}
      keyExtractor={(item) => item?.id}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
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
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingLeft: 15,
    height: 52,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default DraggableListContainer;
