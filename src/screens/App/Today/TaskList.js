import { useEffect, useState } from "react";
import { View, ScrollView, Keyboard, StyleSheet } from "react-native";
import IoniIcons from "react-native-vector-icons/Ionicons";

import { ListItem, Text, useTheme, CheckBox } from "@rneui/themed";

const TaskList = ({
  editMode,
  tasks,
  handleToggleTaskFocus,
  handleToggleTaskComplete,
  currentTask,
  isLoadingToggle,
}) => {
  const { theme } = useTheme();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onCheckTask = (_task) => () => handleToggleTaskComplete(_task);
  const onToggleFocus = (_task) => () => handleToggleTaskFocus(_task);
  return (
    <View style={{ maxHeight: isKeyboardVisible ? 150 : 600 }}>
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
              return (
                <ListItem
                  key={index}
                  containerStyle={{
                    padding: 10,
                    borderBottomColor: "#e7e8f0",
                    borderBottomWidth: 1,
                  }}
                >
                  <ListItem.Content style={styles.listContent}>
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
                    <View style={styles.listRow}>
                      {editMode && (
                        <IoniIcons
                          style={{ fontSize: 20, marginRight: 10 }}
                          color={task.focus ? theme.colors.primary : "black"}
                          name={"key"}
                          onPress={onToggleFocus(task)}
                        />
                      )}
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
