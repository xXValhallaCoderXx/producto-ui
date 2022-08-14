import axios from "axios";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ToastAndroid } from "react-native";
import JwtService from "../../../services/auth-service";
import { ListItem, Text, Button, Icon, Input, useTheme } from "@rneui/themed";
import { Switch, Dialog } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

const GoalScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState("unknown");

  const [value, setValue] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchTasks = async () => {
    const response = await fetch(
      `${Constants.manifest.extra.baseUrl}/api/v1/task`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JwtService.accessToken}`,
        },
      }
    );
    const json = await response.json();
    console.log("REPSONE: ", json);
    setTasks(json);
  };

  // const toggleCategory = async (category) => {
  //   try {
  //     await axios.post(
  //       `${Constants.manifest.extra.baseUrl}/api/v1/tasks/update`,
  //       {
  //         active: !category.active,
  //         categoryId: category.id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${JwtService.accessToken}`,
  //         },
  //       }
  //     );
  //     ToastAndroid.show("Updated!", ToastAndroid.SHORT);
  //   } catch (err) {
  //     console.log("X: ", err);
  //   }
  // };

  // const handleToggleSwitch = (category) => async () => {
  //   await toggleCategory(category);
  //   await fetchTasks();
  // };

  const onSubmitCategory = async () => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/task`,
        {
          title: categoryName,
          categoryId: 1,
          description: "",
        },
        {
          headers: {
            Authorization: `Bearer ${JwtService.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.log("X: ", err);
    }
    setCountry("unknown");
    await fetchTasks();
    setCategoryName("");
    setVisible(false);
  };

  const onActionSelect = (value, index) => {
    if (value === "add") {
      setVisible(true);
    }
    setCountry(value);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 50,
          paddingLeft: 30,
          paddingRight: 30,
          flexDirection: "row",
        }}
      >
        <Text h4>All Tasks</Text>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            height: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Picker
            selectedValue={country}
            onValueChange={onActionSelect}
            mode="dropdown" // Android only
            style={styles.picker}
          >
            <Picker.Item label="Actions" value="unknown" />
            <Picker.Item label="Add Task" value="add" />
          </Picker>
        </View>
      </View>

      <View style={{ paddingLeft: 10, paddingRight: 30, marginTop: 10 }}>
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 16, fontWeight: "600" }}>
                  {task.title}
                </ListItem.Title>
              </ListItem.Content>
              {/* <Switch
                onValueChange={handleToggleSwitch(category)}
                value={category.active}
              /> */}
            </ListItem>
          ))
        ) : (
          <Text>No results found...</Text>
        )}
      </View>
      <StatusBar style="auto" />
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Add a new task" />
        <Input
          onChangeText={(value) => setCategoryName(value)}
          value={categoryName}
          nativeID="categoryName"
          placeholder="Task name..."
          style={{ marginTop: 15 }}
        />
        <Button
          disabled={!categoryName}
          // loading={loading}
          title="Submit"
          onPress={onSubmitCategory}
          color={theme.colors.primary}
        />
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 15,
  },
  picker: {
    width: 150,
    color: "white",
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default GoalScreen;
