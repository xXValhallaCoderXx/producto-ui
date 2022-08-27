import { useState, useEffect, useRef } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import { isBefore, endOfDay } from "date-fns";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input, useTheme, Button, Icon } from "@rneui/themed";

const AddItem = ({ handleCreateNewTask, editMode, currentDate }) => {
  const { theme } = useTheme();
  const addTaskInputRef = useRef(null);
  const [addTask, setAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
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
        setAddTask(false);
        setTaskName("");
        setError("");
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleOnPress = () => {
    setAddTask(true);
    addTaskInputRef.current && addTaskInputRef.current.focus();
    setTaskName("");
    setError("");
  };

  const handleOnPressCancel = () => {
    setAddTask(true);
    setTaskName("");
    setError("");
    Keyboard.dismiss();
  };

  const onSubmitTask = async () => {
    if (taskName.length < 1) {
      setError("Task name too short");
    } else {
      try {
        // await httpClient.post(`/task`, { title: taskName, focus: true });
        await handleCreateNewTask(taskName);
        setTaskName("");
        setAddTask(false);
      } catch (err) {
        console.log("err: ", err);
      }
    }
  };
  if (!editMode) {
    return null;
  }

  if (isBefore(endOfDay(currentDate), endOfDay(new Date()))) {
    return null;
  }

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      {isKeyboardVisible || addTask ? (
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 7, marginLeft: -7 }}>
              <Input
                placeholder="Enter task name..."
                autoFocus
                inputContainerStyle={{ borderBottomColor: "white" }}
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
                onPress={handleOnPressCancel}
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
          TouchableComponent={TouchableWithoutFeedback}
          color={theme.colors.primary}
          buttonStyle={{ display: "flex", justifyContent: "flex-start" }}
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
