import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { useKeyboard } from "@react-native-community/hooks";
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
  const keyboard = useKeyboard();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const addTaskInputRef = useRef(null);
  const [taskName, setTaskName] = useState("");

  // useEffect(() => {
  //   if (!keyboard.keyboardShown) {
  //     createTask();
  //   }
  // }, [!keyboard.keyboardShown]);

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
    await createTask();
  };

  const createTask = async () => {
    dispatch(toggleAddTaskMode(false));
    if (taskName.length > 0) {
      const newValue = taskName;
      setTaskName("");
      await handleCreateNewTask(newValue);
    }
  };

  if (focusMode) {
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
            paddingTop: 8,
            paddingBottom: 8,
          }}
          style={{ borderRadius: 1 }}
          labelStyle={{
            fontWeight: "700",
            // fontSize: 16,
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
