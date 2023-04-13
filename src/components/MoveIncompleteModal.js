import Button from "./Button";
import {
  Dialog,
  Text,
  useTheme,
  List,
  Checkbox,
  Portal,
} from "react-native-paper";

import { ScrollView, View } from "react-native";
import { useState, useMemo } from "react";

const MoveIncompleteModal = ({
  isVisible,
  onPress,
  onCancel,
  tasks,
  currentDate,
}) => {
  const theme = useTheme();
  const [checkedDates, setCheckedDates] = useState({});

  const parsedDates = useMemo(() => {
    if (tasks) {
      return tasks?.filter((_task) => _task.completed !== true);
    }
    return [];
  }, [currentDate]);

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
                    style={{ paddingLeft: 0 }}
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
