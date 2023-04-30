import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, List } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { OpacityDecorator } from "react-native-draggable-flatlist";
import { format, startOfDay, endOfDay } from "date-fns";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { setEditingTask, selectCurrentDate } from "../today-slice";

const ListItem = ({ drag, item }) => {
  const dispatch = useDispatch();
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const currentDate = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);
  const editTaskId = useSelector((state) => state.today.editingTask);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [localIsChecked, setLocalIsChecked] = useState({ id: "" });
  const [updateTaskApi] = useUpdateTaskMutation();

  const handleOnChange = (_value) => {
    setEditTaskTitle(_value);
  };

  const handleOnBlur = (e) => {
    e.stopPropagation();
    updateTaskApi({
      id: editTaskId,
      data: {
        title: editTaskTitle,
      },
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
    dispatch(setEditingTask(null));
  };

  const handlePressDelete = () => {};

  const handleOnCheckTask = () => {
    updateTaskApi({
      id: item.id,
      data: {
        completed: !item.completed,
      },
      start: startOfDay(currentDate).toISOString(),
      end: endOfDay(currentDate).toISOString(),
    });
  };
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
                underlineColorAndroid="transparent"
                style={styles.editTaskInput}
              />
            </View>
          )}
          right={() => (
            <View style={{ justifyContent: "center" }}>
              <TouchableOpacity onPress={handlePressDelete}>
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
      //   disabled={addTaskMode || !!editTaskId}
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
        console.log("GO");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setEditTaskTitle(item?.title);
        dispatch(setEditingTask(item.id));
      }}
      onPress={() => {
        if (focusMode) {
          setLocalIsChecked({ id: item.id });
          setTimeout(() => {
            handleOnCheckTask();
          }, 300);
        } else {
          if (!item.id) {
            setLocalIsChecked({ id: item.id });
          }
          setLocalIsChecked({ id: "" });
          handleOnCheckTask();
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
            onPress={handleOnCheckTask}
          />
        </View>
      )}
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

export default ListItem;
