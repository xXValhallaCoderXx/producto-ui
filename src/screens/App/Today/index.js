import axios from "axios";
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ToastAndroid } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import IoniIcons from "react-native-vector-icons/Ionicons";
import JwtService from "../../../services/auth-service";
import { format } from "date-fns";
import httpClient from "../../../api/api-handler";

import {
  ListItem,
  Text,
  Button,
  Input,
  useTheme,
  LinearProgress,
  CheckBox,
} from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { toggleEdit } from "./today-slice";

const ListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    setProgress(Math.round((completed / total) * 100) / 100);
  }, [tasks]);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchTasks = async () => {
    try {
      const response = await httpClient.get("/task");
      setTasks(response.data);
    } catch (err) {
      console.log("err", err.response);
    }
  };

  const toggleCategory = async (task) => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/task/${task.id}`,
        {
          ...task,
        },
        {
          headers: {
            Authorization: `Bearer ${JwtService.accessToken}`,
          },
        }
      );
      ToastAndroid.show("Updated!", ToastAndroid.SHORT);
    } catch (err) {
      console.log("X: ", err);
    }
  };

  const handleToggleSwitch = (task) => async () => {
    await toggleCategory({
      ...task,
      completed: !task.completed,
      taskId: task.id,
    });
    await fetchTasks();
  };

  const handleToggleFocus = (task) => async () => {
    console.log("go");
    await toggleCategory({
      ...task,
      focus: !task.focus,
      taskId: task.id,
    });
    await fetchTasks();
  };

  const onSubmitTask = async () => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/task`,
        {
          title: taskTitle,
          description: "",
        },
        {
          headers: {
            Authorization: `Bearer ${JwtService.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.log("X: ", err);
    }
    await fetchTasks();
    setTaskTitle("");
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 50,
          paddingLeft: 30,
          paddingRight: 30,
          flexDirection: "row",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text h4 style={{ color: theme.colors.primary }}>
            Today
          </Text>
          <Text h4>'s tasks</Text>
        </View>

        <EvilIcon
          onPress={() => dispatch(toggleEdit({ editMode: !editMode }))}
          style={{ fontSize: 40 }}
          color={theme.colors.primary}
          name={editMode ? "unlock" : "lock"}
        />
      </View>

      <View style={{ paddingRight: 30, paddingLeft: 30, paddingTop: 0 }}>
        <Text style={{ marginLeft: -5 }} h6>
          {format(new Date(), "	EEE, d LLL yyyy").toUpperCase()}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 20,
            marginTop: 5,
          }}
        >
          {editMode && (
            <>
              <LinearProgress
                style={{
                  marginVertical: 15,
                  height: 15,
                  borderRadius: 8,
                  flex: 0.85,
                }}
                value={progress}
                color={theme.colors.primary}
                variant="determinate"
              />
              <Text
                h6
                style={{
                  flex: 0.15,
                  textAlign: "center",
                  color: theme.colors.primary,
                  fontWeight: "700",
                }}
              >
                {progress || 0 * 100}%
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={{ paddingRight: 30, paddingLeft: 30, marginTop: 10 }}>
        {tasks.length === 0 ? (
          <Text>No Tasks Added</Text>
        ) : (
          tasks
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
            })
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <MaterialIcons
            onPress={toggleDialog}
            style={{ paddingRight: 4 }}
            name={"add"}
          />
          <Text onPress={toggleDialog}>Add Item</Text>
        </View>
      </View>
      <StatusBar style="auto" />
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Create a new Task" />
        <Text>Each step, takes you closer!</Text>
        <Input
          onChangeText={(value) => setTaskTitle(value)}
          value={taskTitle}
          nativeID="taskTitle"
          placeholder="Enter Task Name..."
          style={{ marginTop: 15 }}
        />
        <Button
          disabled={!taskTitle}
          // loading={loading}
          title="Submit"
          onPress={onSubmitTask}
          color={theme.colors.primary}
        />
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 15,
  },
});

export default ListScreen;
