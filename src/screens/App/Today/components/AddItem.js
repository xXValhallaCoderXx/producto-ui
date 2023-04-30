import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from "react-native";
import { toggleAddTaskMode, selectCurrentDate } from "../today-slice";
import { useCreateTaskMutation } from "../../../../api/task-api";

const AddItem = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const currentDate = useSelector(selectCurrentDate);
  const [createTaskApi] = useCreateTaskMutation();
  const [value, setValue] = useState("");

  const handleOnPress = () => {
    dispatch(toggleAddTaskMode(true));
  };

  const handleOnChange = (_value) => {
    setValue(_value);
  };

  const handleOnBlur = () => {
    if (value) {
      createTaskApi({
        title: value,
        deadline: currentDate.toISOString(),
      });
    }
    setValue("");
    dispatch(toggleAddTaskMode(false));
  };

  return (
    <View>
      {addTask ? (
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter task name..."
            placeholderTextColor="#808080"
            onChangeText={handleOnChange}
            value={value}
            autoFocus
            onBlur={handleOnBlur}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
          />
        </View>
      ) : (
        <Button
          type="clear"
          icon="plus"
          contentStyle={styles.btnContent}
          style={styles.btnStyle}
          labelStyle={styles.label}
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

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 16,
    backgroundColor: "white",
  },
  inputWrapper: {
    paddingLeft: 25,
    paddingTop: 17,
  },
  btnContent: {
    justifyContent: "flex-start",
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  btnLabel: {
    fontWeight: "700",
  },
  btnStyle: {
    borderRadius: 1,
  },
});

export default AddItem;
