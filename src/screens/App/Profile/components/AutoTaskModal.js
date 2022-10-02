import { Button } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Text } from "../../../../components";
import { useTheme, ListItem, CheckBox } from "@rneui/themed";
import { useGetIncompleteDetailTasksQuery } from "../../../../api/task-api";
import { format } from "date-fns";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

const AutoTaskModal = ({ isVisible, onPress, onCancel }) => {
  const { theme } = useTheme();
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
    console.log("TASK:  ", task);
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
  console.log("CHECKED: ", checkedDates)
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
      {Object.keys(parsedDates).length === 0 && (
        <Text type="h4">No Overdue Tasks</Text>
      )}
      <ScrollView style={{ maxHeight: 350 }}>
        {Object.keys(parsedDates).map((k) => {
          return (
            <View key={k}>
              <View style={{ backgroundColor: "#f9f9f9", padding: 5 }}>
                <Text type="h3" color="secondary">
                  {format(new Date(k), "EEE, d LLL yyyy")}
                </Text>
              </View>

              {parsedDates[k].map((item, _index) => {
                return (
                  <ListItem key={_index} containerStyle={{ padding: 7 }}>
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
            </View>
          );
        })}
      </ScrollView>

      <Dialog.Actions>
        <Button
          onPress={onClickConfirm}
          title="Confirm"
          disabled={Object.keys(parsedDates).length === 0}
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
