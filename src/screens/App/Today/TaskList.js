import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Keyboard,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Haptics from 'expo-haptics';
import { format } from "date-fns";
import IoniIcons from "react-native-vector-icons/Ionicons";
import { useUpdateTaskMutation } from "../../../api/task-api";

import { ListItem, Text, useTheme, CheckBox } from "@rneui/themed";

const TaskList = ({
  editMode,
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  currentTask,
  isLoadingToggle,
  utcDate,
}) => {
  const { theme } = useTheme();
  const [editTask, setEditTask] = useState(null);
  const [value, setTaskValue] = useState("");
  const [updateTaskApi, updateTaskInfo] = useUpdateTaskMutation();
  const onCheckTask = (_task) => () => handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => () => handleToggleTaskFocus(_task);

  const handleOnLongPress = (_task) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setEditTask(_task.id);
    setTaskValue(_task.title)
  };

  const handleOnChange = (_value) => {
    setTaskValue(_value)
  }

  const handleOnBlur = async () => {
    await updateTaskApi({id: editTask, title: value, date:format(utcDate, "yyyy-MM-dd")  })
    setEditTask(null)
  }


  return (
    <View>
      {tasks.length === 0 ? (
        <Text style={{ marginTop: 15 }}>
          Add a task to start your{" "}
          <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
            productivity!
          </Text>
        </Text>
      ) : (
        <ScrollView style={{ maxHeight: 400, marginTop: 15 }}>
          {tasks
            .filter((task) => {
              if (!editMode && !task.focus && !task.completed) {
                return false;
              }
              return task;
            })
            .map((task, index) => {
              if (task.id === editTask) {
                return (
                  <ListItem
                    key={index}
                    onLongPress={handleOnLongPress(task)}
                    containerStyle={{
                      padding: 10,
                      borderBottomColor: "#e7e8f0",
                      borderBottomWidth: 1,
                    }}
                  >
                    <ListItem.Content style={styles.listContent}>
                      <View style={styles.listRow}>
                        <TextInput
                        
                          autoFocus
                        
                          onChangeText={handleOnChange}
                          value={value}
                          onBlur={handleOnBlur}
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
                          height: 35
                        }}
                      >
               
                      </View>
                      {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
                    </ListItem.Content>
                  </ListItem>
                );
              }
              return (
                <ListItem
                  key={index}
                  onLongPress={handleOnLongPress(task)}
                  containerStyle={{
                    padding: 10,
                    borderBottomColor: "#e7e8f0",
                    borderBottomWidth: 1,
                  }}
                >
                  <ListItem.Content style={styles.listContent}>
                    <View style={styles.listRow}>
                      {editMode && (
                        <IoniIcons
                          style={{
                            fontSize: 22,
                            marginRight: 20,
                            transform: [{ rotate: "45deg" }],
                          }}
                          color={task.focus ? theme.colors.primary : "black"}
                          name={"key-outline"}
                          onPress={onToggleFocus(task)}
                        />
                      )}
                      <ListItem.Title
                        style={{
                          color: task.completed ? "gray" : "black",
                          textDecorationLine: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </ListItem.Title>
                    </View>
                    <View
                      style={{ justifyContent: "flex-end", ...styles.listRow }}
                    >
                   <CheckBox
                        checked={task.completed}
                        containerStyle={{ padding: 0 }}
                        onPress={onCheckTask(task)}
                        disabled={task.id === currentTask && isLoadingToggle}
                      /> 
                    </View>
                    {/* <ListItem.Subtitle>what</ListItem.Subtitle> */}
                  </ListItem.Content>
                </ListItem>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default TaskList;
