import axios from "axios";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ToastAndroid } from "react-native";
import JwtService from "../../../services/auth-service";
import {
  ListItem,
  Text,
  Button,
  Icon,
  Input,
  useTheme,
  Tab,
} from "@rneui/themed";
import { Switch, Dialog } from "@rneui/themed";

const ListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const fetchCategories = async () => {
    const response = await fetch(
      `${Constants.manifest.extra.baseUrl}/api/v1/categories`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JwtService.accessToken}`,
        },
      }
    );
    const json = await response.json();
    // console.log("CATEOGIRES: ", json.data)
    setCategories(json.data);
  };

  const toggleCategory = async (category) => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/categories/update`,
        {
          active: !category.active,
          categoryId: category.id,
        },
        {
          headers: {
            Authorization: `Bearer ${JwtService.accessToken}`,
          },
        }
      );
      ToastAndroid.show("Updated!", ToastAndroid.SHORT);
    } catch (err) {
      console.log("X: ", err);
    }
  };

  const handleToggleSwitch = (category) => async () => {
    await toggleCategory(category);
    await fetchCategories();
  };

  const onSubmitCategory = async () => {
    try {
      await axios.post(
        `${Constants.manifest.extra.baseUrl}/api/v1/categories`,
        {
          name: categoryName,
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
    await fetchCategories();
    setCategoryName("");
    setVisible(false);
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
        <Text style={{ fontWeight: "700", fontSize: 30 }}>Today</Text>
        <Button
          onPress={toggleDialog}
          type="outline"
          color="primary"
          style={{ padding: 15 }}
        >
          <Icon color="#5048E5" name="add" style={{ paddingRight: 10 }} />
          Add New
        </Button>
      </View>

      <View style={{ padding: 30, paddingLeft: 20 }}>
        {categories.length > 0 ? (
          <Tab
            indicatorStyle={{
              backgroundColor: "purple",
              height: 3,
            }}
            value={0}
            variant="primary"
          >
            {categories.map((category) => (
              <Tab.Item
                style={{ color: "black" }}
                // containerStyle={{ backgroundColor: "" }}
              >
                {category.name}
              </Tab.Item>
            ))}
          </Tab>
        ) : (
          <Text>No Results</Text>
        )}
      </View>
      <StatusBar style="auto" />
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Create a new Goal" />
        <Text>
          These can be toggled to change visibility, depending on your focus
        </Text>
        <Input
          onChangeText={(value) => setCategoryName(value)}
          value={categoryName}
          nativeID="categoryName"
          placeholder="Enter Cateogry Name..."
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
});

export default ListScreen;
