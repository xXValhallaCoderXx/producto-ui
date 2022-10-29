import React, { useState, useRef, useEffect, useMemo } from "react";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Haptics from "expo-haptics";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { ListItem, CheckBox } from "@rneui/themed";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { format } from "date-fns";
import { useTheme, Text } from "@rneui/themed";
import IoniIcons from "react-native-vector-icons/Ionicons";
import { setSortedData } from "../../../../shared/slice/task-sort-slice";
import { useDispatch, useSelector } from "react-redux";
import { toggleEditMode } from "../../../../shared/slice/global-slice";
const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
  onCheckTaskRow,
  onToggleFocus,
}) => {
  // const [data, setData] = useState([]);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const sortedTaskMap = useSelector((state) => state.persist);
  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const x = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);

    return () => {
      x.remove();
    };
  }, []);

  const sortData = useMemo(() => {
    if (tasks.length > 0) {
      const taskSortId = sortedTaskMap?.data[currentDate];
      if (taskSortId) {
        tasks.sort(function (a, b) {
          return taskSortId.indexOf(a.id) - taskSortId.indexOf(b.id);
        });
      }

      return tasks;
    } else {
      return [];
    }
  }, [tasks]);

  let countRef = useRef(0).current;
  let countTimer = useRef(null);

  const handleOnBlur = async () => {
    await updateTaskApi({
      id: editTask,
      title: value,
      date: format(utcDate, "yyyy-MM-dd"),
    });
  };

  const onKeyboardDidHide = (event) => {
    setEditTask(null);
    setTaskValue("");
  };

  const handleOnChange = (_value) => {
    setTaskValue(_value);
  };

  const renderItem = ({ item, drag, isActive }) => {
    if (item && item.id === editTask) {
      return (
        <View key={item.id} style={styles.listRow}>
          <View style={{ justifyContent: "center" }}>
            <TextInput
              onChangeText={handleOnChange}
              value={value}
              onBlur={handleOnBlur}
              autoFocus
              underlineColorAndroid="transparent"
              style={{
                fontSize: 16,
                backgroundColor: "white",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              paddingRight: 15,
            }}
            onPress={handleOnPressDelete(item.id)}
          >
            <MaterialIcons
              name="trash-o"
              color={"#6B7280"}
              style={{ fontSize: 25, paddingRight: 3 }}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ScaleDecorator>
        <TouchableWithoutFeedback
          onLongPress={drag}
          disabled={isActive}
          onPress={() => {
            countRef++;
            if (countRef == 2) {
              clearTimeout(countTimer.current);
              countRef = 0;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditTask(item.id);
              setTaskValue(item.title);
              dispatch(toggleEditMode(true));
            } else {
              countTimer.current = setTimeout(() => {
                onCheckTaskRow(item);
                countRef = 0;
              }, 250);
            }
          }}
          key={item.id}
        >
          <View style={styles.listRow}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 5,
              }}
            >
              {focusMode && currentDate === todayDate && (
                <IoniIcons
                  style={{
                    fontSize: 25,
                    marginRight: 15,
                    transform: [{ rotate: "315deg" }, {scaleX: -1}],
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
            <View style={{ justifyContent: "center" }}>
              <CheckBox
                checked={item.completed}
                containerStyle={{ padding: 0, paddingRight: 3 }}
                onPress={onCheckTask(item)}
                // disabled={isLoadingToggle}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={sortData}
      onDragEnd={async ({ data }) => {
        const itemSort = data.map((item) => item.id);
        const taskIdsInSortOrder = JSON.stringify(itemSort);
        dispatch(
          setSortedData({ date: currentDate, tasks: taskIdsInSortOrder })
        );
      }}
      keyboardShouldPersistTaps="always"
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingTop: 15,
    // paddingBottom: 15,
    height: 65,
    borderBottomWidth: 0.5,
    borderBottomColor: "#c6c6c6",
  },
});

export default DraggableListContainer;

// <View style={styles.listRow}>
// <TextInput
//   // onChangeText={handleOnChange}
//   value={item.title}
//   // onBlur={handleOnBlur}
//   underlineColorAndroid="transparent"
//   style={{
//     fontSize: 16,

//     backgroundColor: "white",
//   }}
// />
// </View>
// <View
// style={{
//   justifyContent: "flex-end",
//   ...styles.listRow,
//   marginRight: 15,
//   height: 35,
// }}
// >
// <TouchableOpacity
// //   onPress={handleOnPressDelete}
// >
//   {/* <MaterialIcons
//       name="trash-o"
//       color={"#6B7280"}
//       style={{ fontSize: 25 }}
//     /> */}
// </TouchableOpacity>
// </View>
// {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
