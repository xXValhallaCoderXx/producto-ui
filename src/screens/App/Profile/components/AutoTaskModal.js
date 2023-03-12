import Button from "../../../../components/Button";
import {
  Dialog,
  Text,
  useTheme,
  List,
  Checkbox,
  Portal,
} from "react-native-paper";
import { useGetIncompleteDetailTasksQuery } from "../../../../api/task-api";
import { format } from "date-fns";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";

const AutoTaskModal = ({ isVisible, onPress, onCancel, isLoading }) => {
  const theme = useTheme();
  const { data, refetch } = useGetIncompleteDetailTasksQuery({});
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
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8 }}
        visible={isVisible}
        onDismiss={onHandleCancel}
      >
        <Dialog.Title style={{ fontSize: 24, fontWeight: "600" }}>
          Move Tasks
        </Dialog.Title>
        <Dialog.Content>
          {Object.keys(parsedDates).length === 0 ? (
            <View>
              <Text
                style={{
                  marginBottom: 20,
                  color: "#6B7280",
                  fontSize: 16,
                  fontWeight: "400",
                }}
              >
                No Overdue Tasks
              </Text>
              <Text>
                Newly created tasks will be automatically moved if not completed
                on the day set
              </Text>
            </View>
          ) : (
            <Text
              style={{
                marginBottom: 20,
                color: "#6B7280",
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              Select incomplete tasks that you want to move to Today.
            </Text>
          )}
          <ScrollView style={{ maxHeight: 350 }}>
            {Object.keys(parsedDates).map((k) => {
              return (
                <View key={k}>
                  <View style={{ backgroundColor: "#f9f9f9", padding: 5 }}>
                    <Text
                      style={{
                        color: "#6B7280",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      {format(new Date(k), "EEE, d LLL yyyy")}
                    </Text>
                  </View>

                  {parsedDates[k].map((item, _index) => {
                    return (
                      <List.Item
                        key={item.id}
                        title={item.title}
                        titleStyle={{ marginLeft: -5 }}
                        style={{ paddingLeft: 0, paddingRight: 0 }}
                        onPress={onClickCheckbox(item)}
                        right={() => (
                          <View style={{ marginRight: -5 }}>
                            <Checkbox.Android
                              status={
                                checkedDates[item.id] ? "checked" : "unchecked"
                              }
                              onPress={onClickCheckbox(item)}
                            />
                          </View>
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
            disabled={isLoading}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AutoTaskModal;
