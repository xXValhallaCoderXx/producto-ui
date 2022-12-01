import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { toggleEditMode } from "../../../../shared/slice/global-slice";
import DraggableFlatList, {
  OpacityDecorator,
} from "react-native-draggable-flatlist";

const CheckedImg = require("../../../../../assets/checkbox-checked.png");
const UncheckedImg = require("../../../../../assets/checkbox-unchecked.png");

export default function App({
  focusMode = false,
  tasks,
  toggleComplete,
  updateTaskApi,
  handleDelete,
  utcDate,
}) {
  const scrollViewRef = useRef(null);
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const dispatch = useDispatch();
  const editMode = useSelector((state) => state.global.editMode);

  const handleOnLongPress = (_item, index) => (e) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scrollViewRef.current.scrollToIndex({ animated: true, index });
    setEditTask(_item.id);
    dispatch(toggleEditMode({editMode: _item.id}))
    setTaskValue(_item.title);
    // dispatch(toggleEditMode(true));
  };
  console.log("EDIT MODE: ", editMode);
  console.log("Edit Task", editTask)
  const handleOnChange = (_value) => {
    setTaskValue(_value);
  };

  const handleOnPressDelete = (_value) => () => {
    handleDelete(_value);
  };

  const handleOnComplete = (item) => () => {
    if (editTask === null) {
      toggleComplete(item);
    }
  };

  const handleOnBlur = async () => {
    setEditTask(null);
    dispatch(toggleEditMode({editMode: null}))
    setTaskValue("");
    await updateTaskApi({
      id: editTask,
      title: value,
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const renderItem = ({ item, drag, isActive, index }) => {
    if (item && item.id === editTask) {
      return (
        <OpacityDecorator>
          <TouchableWithoutFeedback key={item.id} onLongPress={drag}>
            <View style={styles.listRow}>
              <View style={{ justifyContent: "center" }}>
                <TextInput
                  onChangeText={handleOnChange}
                  value={value}
                  onBlur={handleOnBlur}
                  autoFocus
                  underlineColorAndroid="transparent"
                  style={{
                    fontSize: 18,
                    backgroundColor: "white",
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    paddingRight: 15,
                  }}
                  onPress={handleOnPressDelete(item.id)}
                >
                  <FontAwesome
                    name="trash-o"
                    color={"#6B7280"}
                    style={{ fontSize: 25, paddingRight: 5 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    marginRight: -5,
                  }}
                  disabled
                >
                  <MaterialIcons
                    name="drag-indicator"
                    color={"#6B7280"}
                    style={{ fontSize: 25, padding: 0 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </OpacityDecorator>
      );
    }
    return (
      <OpacityDecorator>
        <TouchableWithoutFeedback
          onPress={handleOnComplete(item)}
          onLongPress={handleOnLongPress(item, index)}
          // onLongPress={drag}
          disabled={isActive}
          key={item.id}
        >
          <View style={styles.listRow}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {focusMode && currentDate === todayDate && (
                <Ionicons
                  style={{
                    fontSize: 25,
                    marginRight: 15,
                    transform: [{ rotate: "315deg" }, { scaleX: -1 }],
                  }}
                  color={item.focus ? theme.colors.primary : "#111827"}
                  name={"key-outline"}
                  onPress={onToggleFocus(item)}
                />
              )}
              <Text
                style={{
                  color: item.completed ? "gray" : "#111827",
                  textDecorationLine: item.completed ? "line-through" : "none",
                  fontSize: 18,
                }}
              >
                {item.title}
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity onPress={handleOnComplete(item)}>
                <Image
                  style={{ maxHeight: 20, maxWidth: 20 }}
                  source={item.completed ? CheckedImg : UncheckedImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </OpacityDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={tasks}
      ref={scrollViewRef}
      // onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="always"
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 65,
    borderBottomWidth: 0.5,
    borderBottomColor: "#c6c6c6",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
