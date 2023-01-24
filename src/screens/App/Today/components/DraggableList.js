import React, { useState, useRef, useEffect } from "react";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme, Checkbox, List } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IoniIcons from "react-native-vector-icons/Ionicons";
import { useUpdateTaskMutation } from "../../../../api/task-api";
import { toggleEditMode } from "../today-slice";
import { format } from "date-fns";

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
    if (item && item.id === editTask) {
      return (
        <View key={item.id} onLongPress={drag} style={styles.editItem}>
          <View>
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
            <TouchableOpacity onPress={onPressDelete(item)}>
              <FontAwesome
                name="trash-o"
                color={"#6B7280"}
                style={{ fontSize: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <ScaleDecorator>
        <List.Item
          title={item.title}
          titleStyle={{
            color: item.completed ? "gray" : "black",

            marginLeft: !focusMode ? -10 : 0,
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
              dispatch(toggleEditMode({ editMode: true }));
            } else {
              countTimer.current = setTimeout(() => {
                onCheckTask(item);
                countRef = 0;
              }, 200);
            }
          }}
          style={{ borderBottomColor: "white", borderBottomWidth: 1 }}
          right={() => (
            <View>
              <Checkbox.Android
                status={item.completed ? "checked" : "unchecked"}
                onPress={handleOnCheckTask(item)}
              />
            </View>
          )}
          left={() =>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    height: 52,
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default DraggableListContainer;
