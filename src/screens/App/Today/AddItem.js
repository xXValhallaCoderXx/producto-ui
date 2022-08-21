import { useState } from "react";
import { View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input, useTheme, Button, Icon } from "@rneui/themed";
import httpClient from "../../../api/api-handler";

const AddItem = ({ handleCreateNewTask }) => {
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
        setTaskName("");
        setAddTask(false);
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
              <Icon
                name="check"
                color={theme.colors.primary}
                type="material-icons"
                onPress={onSubmitTask}
              />
              <Icon
                name={"clear"}
                color="#D14343"
                type="material-icons"
                onPress={handleOnPress}
              />
            </View>
          </View>
          {error ? (
            <Text style={{ color: "#D14343", marginTop: -10, marginLeft: 10 }}>
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
