import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { useKeyboard } from "@react-native-community/hooks";
import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from "react-native";
import { toggleAddTaskMode } from "../today-slice";

const AddItem = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const addTaskInputRef = useRef(null);
  const [taskName, setTaskName] = useState("");

  const handleOnPress = () => {
    dispatch(toggleAddTaskMode(true));
  };

  const handleOnChange = () => {
    dispatch(toggleAddTaskMode(false));
  };

  return (
    <View>
      {addTask ? (
        <View
          style={{
            paddingLeft: 25,
          }}
        >
          <TextInput
            placeholder="Enter task name..."
            placeholderTextColor="#808080"
            onChangeText={handleOnChange}
            value={taskName}
            // onBlur={handleOnBlur}
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
