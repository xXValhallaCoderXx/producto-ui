import Button from "./Button";
import {
  Dialog,
  Text,
  useTheme,
  List,
  Checkbox,
  Portal,
} from "react-native-paper";
import { useGetIncompleteDetailTasksQuery } from "../api/task-api";
import { format, isSameDay } from "date-fns";
import { ScrollView } from "react-native";
import { useEffect, useState, useMemo } from "react";

const MoveIncompleteModal = ({
  isVisible,
  onPress,
  onCancel,
  tasks,
  currentDate,
}) => {
  const theme = useTheme();
  const { isLoading, data, refetch } = useGetIncompleteDetailTasksQuery({});
  const [parsedDates, setParsedDates] = useState([]);
  const [checkedDates, setCheckedDates] = useState({});

  const todaysIncompleteTasks = useMemo(() => {
    console.log("CURRENT DAE: ", currentDate);

    return tasks?.filter((task) => {
      console.log(isSameDay(currentDate, new Date(task?.deadline)));
      if (
        format(new Date(task.deadline), "yyyy-MM-dd") ===
        format(currentDate, "yyyy-MM-dd")
      ) {
        return task;
      }
      return null;
    });
  }, [tasks]);
  console.log("TODAYS: ", todaysIncompleteTasks);

  useEffect(() => {
    if (data?.length > 0) {
      const dates = [];
      console.log("CURRENT DATE: ", currentDate);
      data?.forEach((item) => {
        if (currentDate) {
          if (
            format(new Date(item.deadline), "yyyy-MM-dd") ===
            format(currentDate, "yyyy-MM-dd")
          ) {
            dates.push(item);
          }
        } else {
          dates.push(item);
        }
      });
      setParsedDates(dates);
    }
  }, [data, isLoading, currentDate]);

  const onClickCheckbox = (task) => () => {
    const updatedDates = {
      ...checkedDates,
    };
    if (updatedDates[task.id]) {
      delete updatedDates[task.id];
    } else {
      updatedDates[task.id] = true;
    }
    setCheckedDates(updatedDates);
  };

  const onClickConfirm = () => {
    onPress(checkedDates);
  };

  const onHandleCancel = () => {
    setCheckedDates({});
    onCancel();
  };
  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8 }}
        visible={isVisible}
        onDismiss={onHandleCancel}
      >
        <Dialog.Title>Move Tasks</Dialog.Title>
        <Dialog.Content>
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Select incomplete tasks that you want to move to Today.
          </Text>
          {parsedDates.length === 0 ? (
            <Text>No Overdue Tasks</Text>
          ) : (
            <ScrollView
              style={{
                maxHeight: 350,
              }}
            >
              {parsedDates.map((item) => {
                return (
                  <List.Item
                    style={{ paddingLeft: 0, marginLeft: -8 }}
                    key={item.id}
                    title={item.title}
                    onPress={onClickCheckbox(item)}
                    left={() => (
                      <Checkbox.Android
                        status={checkedDates[item.id] ? "checked" : "unchecked"}
                        onPress={onClickCheckbox(item)}
                      />
                    )}
                  />
                );
              })}
            </ScrollView>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            title="Cancel"
            textColor={theme.colors.error}
            onPress={onHandleCancel}
            type="clear"
          />
          <Button
            onPress={onClickConfirm}
            title="Confirm"
            textColor={theme.colors.primary}
            type="clear"
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MoveIncompleteModal;
