import React, { useState, useRef, useEffect } from "react";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { ListItem, Text, useTheme, CheckBox } from "@rneui/themed";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { format } from "date-fns";
import IoniIcons from "react-native-vector-icons/Ionicons";

const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
}) => {
  const [data, setData] = useState(tasks);
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const [updateTaskApi] = useUpdateTaskMutation();
  const editMode = useSelector((state) => state.today.editMode);

  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    setData(tasks);
  }, [tasks]);

  let countRef = useRef(0).current;
  let countTimer = useRef(null);

  const handleOnBlur = async () => {
    setEditTask(null);
    setTaskValue("");
    await updateTaskApi({
      id: editTask,
      title: value,
      date: format(utcDate, "yyyy-MM-dd"),
    });

  };

  const handleOnChange = (_value) => {
    setTaskValue(_value);
  };

  const renderItem = ({ item, drag, isActive }) => {
    if (item.id === editTask) {
      return (
        <ListItem
          key={item.id}
          onLongPress={drag}
          //   containerStyle={{
          //     paddingTop: 15,
          //     paddingBottom: 15,
          //     paddingLeft: 0,
          //     paddingRight: 0,
          //     borderBottomColor: "#e7e8f0",
          //     borderBottomWidth: 1,
          //   }}
        >
          <ListItem.Content style={styles.listContent}>
            <View style={styles.listRow}>
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
            <View
              style={{
                justifyContent: "flex-end",
                ...styles.listRow,
                marginRight: 15,
                height: 35,
              }}
            >
              <TouchableOpacity onPress={handleOnPressDelete(item.id)}>
                <MaterialIcons
                  name="trash-o"
                  color={"#6B7280"}
                  style={{ fontSize: 25 }}
                />
              </TouchableOpacity>
            </View>
            {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
          </ListItem.Content>
        </ListItem>
      );
    }
    return (
      <ScaleDecorator>
        <ListItem
          onLongPress={drag}

          onPress={() => {
            countRef++;
            if (countRef == 2) {
              clearTimeout(countTimer.current);
              countRef = 0;
              console.log("Clicked twice");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditTask(item.id);
              setTaskValue(item.title);
            } else {
              countTimer.current = setTimeout(() => {
                console.log("Clicked Once");
                () => onCheckTask(item)
              

                countRef = 0;
              }, 250);
            }
          }}
          key={item.id}
          //   onLongPress={handleOnLongPress(task)}
          // containerStyle={{
          //   paddingTop: 15,
          //   paddingBottom: 15,
          //   paddingLeft: 0,
          //   paddingRight: 0,
          //   borderBottomColor: "#e7e8f0",
          //   borderBottomWidth: 1,
          // }}
        >
          <ListItem.Content style={styles.listContent}>
            <View style={styles.listRow}>
              {editMode && currentDate === todayDate && (
                <IoniIcons
                  style={{
                    fontSize: 22,
                    marginRight: 20,
                    transform: [{ rotate: "45deg" }],
                  }}
                  color={item.focus ? theme.colors.primary : "black"}
                  name={"key-outline"}
                  //   onPress={onToggleFocus(task)}
                />
              )}
              <ListItem.Title
                style={{
                  color: item.completed ? "gray" : "black",
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
              >
                {item.title}
              </ListItem.Title>
            </View>
            <View style={{ marginRight: -13 }}>
              <CheckBox
                checked={item.completed}
                containerStyle={{ padding: 0 }}
                onPress={onCheckTask(item)}
                // disabled={isLoadingToggle}
              />
            </View>
          </ListItem.Content>
        </ListItem>
      </ScaleDecorator>
    );
  };
  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => {
        setData(data);
      }}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
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
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
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
