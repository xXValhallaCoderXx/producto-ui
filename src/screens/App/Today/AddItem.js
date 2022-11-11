import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, useTheme } from "react-native-paper";
import { View, Text, TouchableWithoutFeedback, TextInput } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddItem = ({ handleCreateNewTask }) => {
  const theme = useTheme();
  // const isToday = useSelector((state) => state.today.isToday);
  const addTaskInputRef = useRef(null);
  const [addTask, setAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (value) => {
    setError("");
    setTaskName(value);
  };

  const handleOnPress = () => {
    setAddTask(true);
    // if (!addTask) {
    //   setTaskName("");
    //   setAddTask(true);
    //   addTaskInputRef.current && addTaskInputRef.current.focus();
    // }
    // setError("");
  };

  const handleOnBlur = async () => {
    setAddTask(false);
    if (taskName.length > 0) {
      const newValue = taskName;
      setTaskName("");
      await handleCreateNewTask(newValue);
    }
  };

  // if (!isToday) {
  //   return null;
  // }

  return (
    <View style={{ alignItems: "flex-start" }}>
      {addTask ? (
        <View>
          <TextInput
            placeholder="Enter task name..."
            autoFocus
            placeholderTextColor="#808080"
            onChangeText={handleOnChange}
            value={taskName}
            onBlur={handleOnBlur}
            underlineColorAndroid="transparent"
            style={{
              fontSize: 16,
              height: 50,
              backgroundColor: "white",
            }}
          />
          {error ? (
            <Text style={{ color: "#D14343", marginTop: -10, marginLeft: 10 }}>
              {error}
            </Text>
          ) : null}
        </View>
      ) : (
        <Button
          mode="text"
          color={theme.colors.primary}
          icon={() => (
            <MaterialIcons
              style={{
                color: theme.colors.primary,
                fontSize: 20,
              }}
              name={"add"}
            />
          )}
          onPress={handleOnPress}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 17,
              marginLeft: 5,
              fontWeight: "600",
            }}
          >
            Add Item
          </Text>
        </Button>
      )}
    </View>
  );
};

export default AddItem;
