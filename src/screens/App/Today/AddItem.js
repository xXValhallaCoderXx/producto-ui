import { useState } from "react";
import { View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input, useTheme, Button } from "@rneui/themed";
import httpClient from "../../../api/api-handler";

const AddItem = ({handleCreateNewTask}) => {
  const { theme } = useTheme();
  const [addTask, setAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const handleOnPress = () => {
    setAddTask(!addTask);
  };

  const onSubmitTask = async () => {
    if (taskName.length < 3) {
      setError("Task name too short");
    } else {
      try {
        await httpClient.post(`/task`, { title: taskName });
        await handleCreateNewTask(taskName);
        setTaskName("")
      } catch (err) {
        console.log("err: ", err);
      }
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      {addTask ? (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 7 }}>
              <Input
                placeholder="Enter task name..."
                onChangeText={(value) => {
                  setError("");
                  setTaskName(value);
                }}
                value={taskName}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 3,
                justifyContent: "space-around",
                marginTop: 10,
              }}
            >
              <MaterialIcons
                style={{ paddingRight: 4, color: "green", fontSize: 25 }}
                name={"check"}
                onPress={onSubmitTask}
              />
              <MaterialIcons
                style={{ paddingRight: 4, color: "red", fontSize: 25 }}
                name={"clear"}
                onPress={handleOnPress}
              />
            </View>
          </View>
          {error ? (
            <Text style={{ color: "red", marginTop: -10, marginLeft: 10 }}>
              {error}
            </Text>
          ) : null}
        </View>
      ) : (
        <Button
          type="clear"
          color={theme.colors.primary}
          containerStyle={{ width: 100 }}
          onPress={handleOnPress}
        >
          <MaterialIcons
            style={{ paddingRight: 4, color: theme.colors.primary }}
            name={"add"}
          />
          Add Item
        </Button>
      )}
    </View>
  );
};

export default AddItem;
