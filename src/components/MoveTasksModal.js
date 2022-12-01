import {
  Button,
  Text,
  Dialog,
  Portal,
  useTheme,
  List,
} from "react-native-paper";
import { useGetIncompleteDetailTasksQuery } from "../api/tasks-api";
import { format } from "date-fns";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import Checked from "../../assets/checkbox-checked.png";
import Unchecked from "../../assets/checkbox-unchecked.png";

const MoveTaskModal = ({
  isVisible,
  onPress,
  onCancel,
  isLoading: isUpdating,
  date,
}) => {
  const theme = useTheme();
  
  const { isLoading, data, refetch } = useGetIncompleteDetailTasksQuery({
    date: format(date, "yyyy-MM-dd"),
  });
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
        onDismiss={onCancel}
      >
        <Dialog.Content>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "700" }}
            color="black"
          >
            Move Tasks
          </Text>
          {isLoading ? (
            <View
              style={{
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 25,
              }}
            >
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Text
                variant="bodyLarge"
                style={{
                  color: theme.colors.secondary,
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Select incomplete tasks that you want to move to Today.
              </Text>

              {Object.keys(parsedDates).length === 0 && (
                <Text type="h4">No Overdue Tasks</Text>
              )}
              {
                <ScrollView style={{ maxHeight: 350 }}>
                  {Object.keys(parsedDates).map((k) => {
                    return (
                      <View key={k}>
                        <View
                          style={{
                            backgroundColor: "#f9f9f9",
                            padding: 8,
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: theme.colors.secondary,
                              fontWeight: "700",
                              fontSize: 16,
                            }}
                          >
                            {format(new Date(k), "EEE, d LLL yyyy")}
                          </Text>
                        </View>

                        {parsedDates[k].map((item, _index) => {
                          return (
                            <TouchableOpacity
                            key={_index}
                              style={{
                                justifyContent: "center",
                                marginRight: 10,
                              }}
                              onPress={onClickCheckbox(item)}
                            >
                              <List.Item
                              
                                title={item.title}
                                titleStyle={{
                                  fontSize: 18,
                                }}
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#d3d3d3",
                                  paddingTop: 20,
                                  paddingBottom: 20
                                }}
                                left={(props) => (
                                  <Image
                                    style={{ maxHeight: 20, maxWidth: 20 }}
                                    source={
                                      checkedDates[item.id]
                                        ? Checked
                                        : Unchecked
                                    }
                                  />
                                )}
                              />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    );
                  })}
                </ScrollView>
              }
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            labelStyle={{
              fontWeight: "600",
              fontSize: 18,
            }}
            style={{ color: theme.colors.primary }}
            onPress={onHandleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            labelStyle={{
              fontWeight: "600",
              fontSize: 18,
            }}
            style={{ color: theme.colors.primary }}
            disabled={isUpdating}
            onPress={onClickConfirm}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default MoveTaskModal;
