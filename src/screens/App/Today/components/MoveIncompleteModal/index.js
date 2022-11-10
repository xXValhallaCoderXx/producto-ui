import { Button } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Text } from "../../../../../components";
import { useTheme, ListItem, CheckBox } from "@rneui/themed";
// import { useGetIncompleteDetailTasksQuery } from "../../../../api/task-api";
import { format } from "date-fns";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useMoveSpecificTasksMutation } from "../../../../../api/task-api";

const AutoTaskModal = ({
  isVisible,
  data,
  onConfirm,
  onCancel,
  isLoading: isAutoTaskLoading,
}) => {
  const { theme } = useTheme();
  const [checkedDates, setCheckedDates] = useState({});

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

  const onClickConfirm = async () => {
    onConfirm(checkedDates);
  };

  const onHandleCancel = () => {
    setCheckedDates({});
    onCancel();
  };

  const filteredDates = data?.reduce(
    (result, item) => (!item.completed ? result.push(item) && result : result),
    []
  );
  return (
    <Dialog isVisible={isVisible} onBackdropPress={onHandleCancel}>
      <Text type="h2" color="black">
        Move Tasks
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Select incomplete tasks that you want to move to Today.
      </Text>

      <ScrollView style={{ maxHeight: 350 }}>
        {filteredDates?.map((item, index) => {
          return (
            <ListItem key={index} containerStyle={{ padding: 7 }}>
              <ListItem.Content
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <CheckBox
                  checked={checkedDates[item.id]}
                  onPress={onClickCheckbox(item)}
                  containerStyle={{ padding: 0 }}
                />
                <Text type="h3" color="black">
                  {item.title}
                </Text>
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ScrollView>

      <Dialog.Actions>
        <Button
          onPress={onClickConfirm}
          title="Confirm"
          disabled={isAutoTaskLoading}
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
        />
        <Button
          title="Cancel"
          disabled={isAutoTaskLoading}
          titleStyle={{ color: theme.colors.primary }}
          onPress={onHandleCancel}
          type="clear"
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default AutoTaskModal;
