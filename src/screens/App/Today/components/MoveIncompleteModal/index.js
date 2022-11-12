import { ScrollView, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import {
  Button,
  Text,
  Dialog,
  Portal,
  List,
  useTheme,
} from "react-native-paper";
import Checked from "../../../../../assets/images/checkbox-checked.png";
import Unchecked from "../../../../../assets/images/checkbox-unchecked.png";

const AutoTaskModal = ({
  isVisible,
  data,
  onConfirm,
  onCancel,
  isLoading: isAutoTaskLoading,
}) => {
  const theme = useTheme();
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
    <Portal>
      <Dialog
        style={{ backgroundColor: "white", borderRadius: 8 }}
        visible={isVisible}
        onDismiss={onHandleCancel}
      >
        <Dialog.Content>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "600" }}
            color="black"
          >
            Move Tasks
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.secondary,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Select incomplete tasks that you want to move to Today.
          </Text>
          <ScrollView contentContainerStyle={{maxHeight: 260}}>
            {filteredDates?.map((item, index) => {
              return (
                <List.Item
                  key={index}
                  title={item.title}
                  style={{ borderBottomWidth: 1, borderBottomColor: "#d3d3d3" }}
                  left={(props) => (
                    <TouchableOpacity
                      style={{ justifyContent: "center", marginRight: 10 }}
                      onPress={onClickCheckbox(item)}
                    >
                      <Image
                        style={{ maxHeight: 20, maxWidth: 20 }}
                        source={checkedDates[item.id] ? Checked : Unchecked}
                      />
                    </TouchableOpacity>
                  )}
                />
              );
            })}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={isAutoTaskLoading} onPress={onClickConfirm}>
            Confirm
          </Button>
          <Button disabled={isAutoTaskLoading} onPress={onHandleCancel}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AutoTaskModal;
