import { useState, useEffect } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from "react-native";
import { toggleAddTaskMode, selectCurrentDate } from "../today-slice";
import { useCreateTaskMutation } from "../../../../api/task-api";

const AddItem = () => {
  const toast = useToast();
  const theme = useTheme();
  const dispatch = useDispatch();
  const addTask = useSelector((state) => state.today.addTaskMode);
  const focusMode = useSelector((state) => state.today.focusMode);
  const currentDate = useSelector(selectCurrentDate);
  const [createTaskApi, createTaskApiResult] = useCreateTaskMutation();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (createTaskApiResult.isError) {
      toast.show("", {
        type: "error",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: `Error creating task!`,
        description: "",
      });
      // TODO - Test removing task from cache
    }
    if (createTaskApiResult.isSuccess) {
      toast.show("", {
        type: "success",
        placement: "top",
        title: `Task created!`,
      });
    }
  }, [createTaskApiResult]);

  const handleOnPress = () => {
    dispatch(toggleAddTaskMode(true));
  };

  const handleOnChange = (_value) => {
    setValue(_value);
  };
  console.log("CURRENT DATA: ", currentDate.toISOString())
  const handleOnBlur = () => {
    if (value) {
      createTaskApi({
        title: value,
        deadline: currentDate.toISOString(),
        start: startOfDay(currentDate).toISOString(),
        end: endOfDay(currentDate).toISOString(),
      });
    }
    setValue("");
    dispatch(toggleAddTaskMode(false));
  };

  if (focusMode) {
    return null;
  }

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
          labelStyle={styles.btnLabel}
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
