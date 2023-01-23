import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useTheme, Button, Checkbox } from "react-native-paper";
import { View, Text, TouchableWithoutFeedback, TextInput } from "react-native";

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
    <View
    // style={{ marginTop: 10 }}
    // keyboardShouldPersistTaps="handled"
    >
      {addTask ? (
        <View>
          <View
            style={{
              paddingLeft: 15,
              display: "flex",
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
            <View
              style={{
                marginTop: 10,
                paddingRight: 4,
              }}
            >
              <Checkbox
                checked={false}
                containerStyle={{ padding: 0 }}
                disabled={true}
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
          icon="plus"
          contentStyle={{
            justifyContent: "flex-start",
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
