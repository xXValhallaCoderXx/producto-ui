import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, TouchableWithoutFeedback, TextInput } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme, Button, CheckBox } from "@rneui/themed";

const AddItem = ({ handleCreateNewTask }) => {
  const { theme } = useTheme();
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
  
    if(!addTask){
      console.log("WEEJEJEJJE", Math.random());
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
      console.log("NEW VALUE: ", newValue)
      await handleCreateNewTask(newValue);

    }
  };

  if (!isToday) {
    return null;
  }

  return (
    <View
      style={{ marginTop: 35 }}
      // keyboardShouldPersistTaps="handled"
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
                display: "flex",
                flexDirection: "row",
                flex: 3,
                justifyContent: "flex-end",
                marginTop: 10,
                paddingRight: 10,
              }}
            >
              <CheckBox
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
          TouchableComponent={TouchableWithoutFeedback}
          color={theme.colors.primary}
          buttonStyle={{
            display: "flex",
            justifyContent: "flex-start",
          }}
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
