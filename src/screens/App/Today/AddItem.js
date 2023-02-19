import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { View, TouchableWithoutFeedback, TextInput } from "react-native";
import { toggleAddTaskMode } from "./today-slice";

const AddItem = ({ handleCreateNewTask, focusMode }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const addTaskInputRef = useRef(null);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (value) => {
    setError("");
    setTaskName(value);
  };

  const handleOnPress = () => {
    if (!addTask) {
      setTaskName("");
      dispatch(toggleAddTaskMode(true));
      addTaskInputRef.current && addTaskInputRef.current.focus();
    }
    // setError("");
  };

  const handleOnBlur = async () => {
    dispatch(toggleAddTaskMode(false));
    if (taskName.length > 0) {
      const newValue = taskName;
      setTaskName("");
      await handleCreateNewTask(newValue);
    }
  };

  if (!focusMode) {
    return null;
  }

  return (
    <View>
      {addTask ? (
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 5,
          }}
        >
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
              backgroundColor: "white",
            }}
          />
        </View>
      ) : (
        <Button
          type="clear"
          icon="plus"
          contentStyle={{
            justifyContent: "flex-start",
            marginLeft: -8,
          }}
          labelStyle={{
            fontWeight: "600",
          }}
          TouchableComponent={TouchableWithoutFeedback}
          color={theme.colors.primary}
          onPress={handleOnPress}
        >
          Add Item
        </Button>
      )}
    </View>
  );
};

export default AddItem;
