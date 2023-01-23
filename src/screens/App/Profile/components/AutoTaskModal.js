import Button from "../../../../components/Button";
import { Dialog, Text, useTheme, List, Checkbox } from "react-native-paper";
import { useGetIncompleteDetailTasksQuery } from "../../../../api/task-api";
import { format } from "date-fns";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

const AutoTaskModal = ({ isVisible, onPress, onCancel }) => {
  const theme = useTheme();
  const { isLoading, data, refetch } = useGetIncompleteDetailTasksQuery({});
  const [parsedDates, setParsedDates] = useState([]);
  const [checkedDates, setCheckedDates] = useState({});
  useEffect(() => {
    if (isVisible) {
      refetch();
    }
  }, [isVisible]);

  useEffect(() => {
    if (data?.length > 0) {
      const dates = {};
      const today = format(new Date(), "yyyy-MM-dd");

      data?.forEach((item) => {
        if (format(new Date(item.deadline), "yyyy-MM-dd") !== today) {
          if (dates[item.deadline]) {
            dates[item.deadline].push(item);
          } else {
            const tempArray = new Array();
            tempArray.push(item);
            dates[item.deadline] = tempArray;
          }
        }
      });
      setParsedDates(dates);
    }
  }, [data]);

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
    <Dialog
      style={{ backgroundColor: "white", borderRadius: 8 }}
      visible={isVisible}
      onDismiss={onHandleCancel}
    >
      <Dialog.Title>Move Tasks</Dialog.Title>
      <Dialog.Content>
        <Text
          color="secondary"
          customStyle={{ marginTop: 15, marginBottom: 20 }}
        >
          Select incomplete tasks that you want to move to Today.
        </Text>
        {Object.keys(parsedDates).length === 0 && <Text>No Overdue Tasks</Text>}
        <ScrollView style={{ maxHeight: 350 }}>
          {Object.keys(parsedDates).map((k) => {
            return (
              <View key={k}>
                <View style={{ backgroundColor: "#f9f9f9", padding: 5 }}>
                  <Text color="secondary">
                    {format(new Date(k), "EEE, d LLL yyyy")}
                  </Text>
                </View>

                {parsedDates[k].map((item, _index) => {
                  return (
                    <List.Item
                      title={item.title}
                      onPress={onClickCheckbox(item)}
                      right={() => (
                        <Checkbox.Android
                          status={
                            checkedDates[item.id] ? "checked" : "unchecked"
                          }
                          onPress={onClickCheckbox(item)}
                        />
                      )}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          onPress={onClickConfirm}
          title="Confirm"
          // disabled={Object.keys(parsedDates).length === 0}
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={onHandleCancel}
          type="clear"
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default AutoTaskModal;
