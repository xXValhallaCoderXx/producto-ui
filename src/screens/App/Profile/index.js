import axios from "axios";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ToastAndroid } from "react-native";
import JwtService from "../../../services/auth-service";
import { ListItem, Avatar } from "@rneui/themed";
import { Switch } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
const ProfileScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState();

  const {
    isLoading,
    isError,
    data,
    error: error2,
    refetch,
  } = useQuery("getCategories", async () => {
    // const data = await axios( `${Constants.manifest.extra.baseUrl}/api/v1/categories`, {
    //   headers: {
    //     Authorization: `Bearer ${JwtService.accessToken}`,
    //   },
    // });
    // return data;
    const response = await fetch(
      `${Constants.manifest.extra.baseUrl}/api/v1/categories`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JwtService.accessToken}`,
        },
      }
    );
    return await response.json();
  });
  useEffect(() => {
    fetchCategories();
  }, []);

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
    console.log("!category.active", !category.active);
    console.log("!category.id", Constants.manifest.extra.baseUrl);
    try {
      console.log("go");
      const response = await fetch(
        `${Constants.manifest.extra.baseUrl}/api/v1/categories/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JwtService.accessToken}`,
          },
          body: {
            active: !category.active,
            categoryId: category.id,
          },
        }
      );
      const data = await response.json();
      console.log(response.status);
      if (response.status) {
        console.log("WHATS THE DATA: ", data);
        setError("Some things missing ah");
      }

  
    } catch (err) {
      console.log("X: ", err);
    }
  };

  const handleToggleSwitch = (category) => async () => {
    await toggleCategory(category);
    // await fetchCategories();
  };
  return (
    <View style={styles.container}>
      <Text>profile Screen!</Text>
      {categories.length > 0 ? (
        categories.map((category, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{category.name}</ListItem.Title>
            </ListItem.Content>
            <Switch
              onValueChange={handleToggleSwitch(category)}
              value={category.active}
            />
          </ListItem>
        ))
      ) : (
        <Text>No Results</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F0DB3",
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default ProfileScreen;
