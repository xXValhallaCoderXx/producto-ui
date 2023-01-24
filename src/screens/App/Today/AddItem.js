import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { View, TouchableWithoutFeedback, TextInput } from "react-native";

const AddItem = ({ handleCreateNewTask }) => {
  const theme = useTheme();

  const isToday = useSelector((state) => state.today.isToday);
  const addTaskInputRef = useRef(null);
  const [addTask, setAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (value) => {
    setError("");
    setTaskName(value);
  };

  const handleOnPress = () => {
    if (!addTask) {
      setTaskName("");
      setAddTask(true);
      addTaskInputRef.current && addTaskInputRef.current.focus();
    }
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
    <View>
      {addTask ? (
        <View>
          <View
            style={{
              paddingLeft: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 7 }}>
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
            </View>
          </View>
        </View>
      ) : (
        <Button
          type="clear"
          icon="plus"
          contentStyle={{
            justifyContent: "flex-start",
            marginLeft: -8,
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
