import { Button } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Text } from "../../../../components";
import { useTheme, ListItem } from "@rneui/themed";
import { useGetIncompleteDetailTasksQuery } from "../../../../api/task-api";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const AutoTaskModal = ({ isVisible, onPress, onCancel }) => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetIncompleteDetailTasksQuery({});
  const [parsedDates, setParsedDates] = useState([]);


  // useEffect(() => {
  //   if (data?.length > 0) {
  //     // const dates = {}
  //     // data?.forEach(item => dates[item.deadline] = [])
  //     // console.log("DATES", dates);
  //     const incompleteTasksOn = [
  //       ...new Set(data?.map((item) => item.deadline)),
  //     ];
  //     console.log("incompleteTasksOn: ", incompleteTasksOn);
  //   }


  // }, [data]);

  return (
    <Dialog isVisible={isVisible} onBackdropPress={onCancel}>
      <Text type="h2" color="black">
        Move Tasks
      </Text>
      <Text
        type="h3"
        color="secondary"
        customStyle={{ marginTop: 15, marginBottom: 20 }}
      >
        Select incomplete tasks that you want to move to Today.s
      </Text>

      {data?.map((item, index) => {
        return (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        );
      })}

      <Dialog.Actions>
        <Button
          onPress={onPress}
          title="Confirm"
          containerStyle={{ paddingLeft: 25 }}
          titleStyle={{ color: theme.colors.primary }}
          type="clear"
        />
        <Button
          title="Cancel"
          titleStyle={{ color: theme.colors.primary }}
          onPress={onCancel}
          type="clear"
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default AutoTaskModal;
