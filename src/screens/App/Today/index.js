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
// import { useGetTasksQuery } from "../../../api";

const ListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState();
  const [taskTitle, setTaskTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const editMode = useSelector((state) => state.today.editMode);
  // const { data, isLoading } = useGetTasksQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchTasks = async () => {
    const res = await axios.get(
      `${Constants.manifest.extra.baseUrl}/api/v1/task`,
      {
        headers: {
          Authorization: `Bearer ${JwtService.accessToken}`,
        },
      }
    );
    setTasks(res.data);
  };

  const toggleCategory = async (task) => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/task/${task.id}`,
        {
          ...task
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
      taskId: task.id
    });
    await fetchTasks();
  };

  const handleToggleFocus = (task) => async () => {
    console.log("go")
    await toggleCategory({
      ...task,
      focus: !task.focus,
      taskId: task.id
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
          categoryId: 1,
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
        <Text h6>THUR, 11 AUG 2022</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <LinearProgress
            style={{
              marginVertical: 15,
              height: 15,
              borderRadius: 8,
              flex: 0.85,
            }}
            value={0.5}
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
            75%
          </Text>
        </View>
      </View>
      <View style={{ paddingRight: 30, paddingLeft: 30, marginTop: 20 }}>
        {tasks.length === 0 ? (
          <Text>No Tasks Added</Text>
        ) : (
          tasks.map((task, index) => {
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
