import { View, ScrollView } from "react-native";
import IoniIcons from "react-native-vector-icons/Ionicons";

import { ListItem, Text, useTheme, CheckBox } from "@rneui/themed";

const TaskList = ({
  editMode,
  tasks,
  handleToggleSwitch,
  handleToggleFocus,
}) => {
  const { theme } = useTheme();
  return (
    <View>
      {tasks.length === 0 ? (
        <Text>
          Add a task to start your{" "}
          <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
            productivity!
          </Text>
        </Text>
      ) : (
        <ScrollView style={{ height: 400 }}>
          {tasks
            .filter((task) => {
              if (!editMode && !task.focus && !task.completed) {
                return false;
              }
              return task;
            })
            .map((task, index) => {
              return (
                <ListItem key={index} bottomDivider>
                  <ListItem.Content
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItem.Title>{task.title}</ListItem.Title>
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {editMode && (
                        <IoniIcons
                          style={{ fontSize: 20, marginRight: 10 }}
                          color={task.focus ? theme.colors.primary : "black"}
                          name={"key"}
                          onPress={handleToggleFocus(task)}
                        />
                      )}
                      <CheckBox
                        checked={task.completed}
                        containerStyle={{ padding: 0 }}
                        onPress={handleToggleSwitch(task)}
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

export default TaskList;
