import React, { useState, useRef, useEffect } from "react";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme, Checkbox, List, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IoniIcons from "react-native-vector-icons/Ionicons";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { format } from "date-fns";

const DraggableListContainer = ({
  tasks,
  handleOnPressDelete,
  utcDate,
  onCheckTask,
  onToggleFocus,
}) => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");

  const [updateTaskApi] = useUpdateTaskMutation();
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = format(utcDate, "yyyy-MM-dd");
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    setData(tasks);
  }, [tasks]);

  // const sortData = async () => {
  //   const hasData = await AsyncStorage.getItem(currentDate);

  //   if (hasData && hasData.length > 0) {
  //     let tempResult = [];
  //     JSON.parse(hasData).forEach((item) => {
  //       const x = data.find((task) => task?.id === item);
  //       tempResult.push(x);
  //     });
  //     setData(tempResult);
  //   } else {
  //     setData(tasks);
  //   }
  // };

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
    if (item && item.id === editTask) {
      return (
        <List.Item>
          <Text>asa</Text>
        </List.Item>
        // <ListItem key={item.id} onLongPress={drag}>
        //   <ListItem.Content style={styles.listContent}>
        //     <View style={styles.listRow}>
        //       <TextInput
        //         onChangeText={handleOnChange}
        //         value={value}
        //         onBlur={handleOnBlur}
        //         autoFocus
        //         underlineColorAndroid="transparent"
        //         style={{
        //           fontSize: 16,
        //           backgroundColor: "white",
        //         }}
        //       />
        //     </View>
        //     <View
        //       style={{
        //         justifyContent: "flex-end",
        //         ...styles.listRow,
        //         marginRight: 15,
        //         height: 35,
        //       }}
        //     >
        //       <TouchableOpacity onPress={handleOnPressDelete(item.id)}>
        //         <FontAwesome
        //           name="trash-o"
        //           color={"#6B7280"}
        //           style={{ fontSize: 25 }}
        //         />
        //       </TouchableOpacity>
        //     </View>
        //     {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
        //   </ListItem.Content>
        // </ListItem>
      );
    }
    return (
      <ScaleDecorator>
        <List.Item
          title={item.title}
          titleStyle={{
            color: item.completed ? "gray" : "black",
            textDecorationLine: item.completed ? "line-through" : "none",
          }}
          onLongPress={drag}
          onPress={() => {
            countRef++;
            if (countRef == 2) {
              clearTimeout(countTimer.current);
              countRef = 0;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditTask(item.id);
              setTaskValue(item.title);
            } else {
              countTimer.current = setTimeout(() => {
                () => onCheckTask(item);
                countRef = 0;
              }, 250);
            }
          }}
          style={{ borderBottomColor: "white", borderBottomWidth: "1px" }}
          right={(props) => (
            <View style={{ paddingRight: 5 }}>
              <Checkbox.Android
                status={item.completed ? "checked" : "unchecked"}
                onPress={onCheckTask(item)}
              />
            </View>
          )}
          left={(props) =>
            focusMode && currentDate === todayDate ? (
              <View style={{ justifyContent: "center" }}>
                <IoniIcons
                  style={{
                    fontSize: 22,
                    marginRight: 10,
                    transform: [{ rotate: "45deg" }],
                  }}
                  color={item.focus ? theme.colors.primary : "black"}
                  name={"key-outline"}
                  onPress={onToggleFocus(item)}
                />
              </View>
            ) : null
          }
        />
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={async ({ data }) => {
        // const itemSort = data.map((item) => item.id);
        // const objectToStore = JSON.stringify(itemSort);
        // AsyncStorage.setItem(currentDate, objectToStore);
        setData(data);
      }}
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
//   {/* <FontAwesome
//       name="trash-o"
//       color={"#6B7280"}
//       style={{ fontSize: 25 }}
//     /> */}
// </TouchableOpacity>
// </View>
// {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
