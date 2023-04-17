import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { isAfter, isSameDay } from "date-fns";
import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from "react-native";
import { toggleAddTaskMode } from "./today-slice";

const AddItem = ({ handleCreateNewTask, focusMode, currentDate }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const addTaskInputRef = useRef(null);
  const [taskName, setTaskName] = useState("");

  const handleOnChange = (value) => {
    setTaskName(value);
  };

  const handleOnPress = () => {
    if (!addTask) {
      setTaskName("");
      dispatch(toggleAddTaskMode(true));
      addTaskInputRef.current && addTaskInputRef.current.focus();
    }
  };

  const handleOnBlur = async () => {
    dispatch(toggleAddTaskMode(false));
    if (taskName.length > 0) {
      const newValue = taskName;
      setTaskName("");
      await handleCreateNewTask(newValue);
    }
  };

  if (
    focusMode ||
    !(isSameDay(currentDate, new Date()) || isAfter(currentDate, new Date()))
  ) {
    return null;
  }

  return (
    <View>
      {addTask ? (
        <View
          style={{
            paddingLeft: 25,
            marginTop: Platform.OS === "ios" ? 10 : 5,
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
            paddingLeft: 10,
          }}
          style={{ borderRadius: 1 }}
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
