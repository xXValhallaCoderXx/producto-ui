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
  const { isLoading, data } = useGetIncompleteDetailTasksQuery({});
  const [parsedDates, setParsedDates] = useState([]);
  const [checkedDates, setCheckedDates] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      const dates = {};
      data?.forEach((item) => {
        if (dates[item.deadline]) {
          dates[item.deadline].push(item);
        } else {
          const tempArray = new Array();
          tempArray.push(item);
          dates[item.deadline] = tempArray;
        }
      });
      setParsedDates(dates);
    }
  }, [data]);

  const onClickCheckbox = (taskId) => () => {
    const updatedDates = {
      ...checkedDates,
    };
    if (updatedDates[taskId]) {
      delete updatedDates[taskId];
    } else {
      updatedDates[taskId] = true;
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

      <ScrollView style={{ height: 350 }}>
        {Object.keys(parsedDates).map((k) => {
          return (
            <View key={k}>
              <View style={{ backgroundColor: "#f9f9f9", padding: 5 }}>
                <Text type="h3" color="secondary">
                  {k.toString()}
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
                        onPress={onClickCheckbox(item.id)}
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
