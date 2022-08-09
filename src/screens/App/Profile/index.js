import axios from "axios";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ToastAndroid } from "react-native";
import JwtService from "../../../services/auth-service";
import { ListItem, Avatar } from "@rneui/themed";
const ProfileScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    fetchCategories();
    // axios
    //   .get(`${Constants.manifest.extra.baseUrl}/api/v1/categories`, {
    //     headers: {
    //       Authorization: `Bearer ${JwtService.accessToken}`,
    //     },
    //   })
    //   .then((res) => {
    //     // console.log("RESPONSE: ", response.data.map(() => console.log("s")));

    //     // const parsedCategories = response.data.map((category) => {
    //     //     return {
    //     //       active: category.active,
    //     //       id: category.id,
    //     //       name: category.name,
    //     //     };
    //     //   });
    //     //   setCategories(parsedCategories);
    //       console.log(res.data);
    //     // if (response.data.length > 0) {

    //     // }
    //   })
    //   .catch((err) => {
    //     console.log("HEHE: ", err);
    //     // ToastAndroid.sho,w(err.response.data.message, ToastAndroid.SHORT);
    //     // setError("Error fetching categories");
    //   });
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

    const res = await axios.get(`${Constants.manifest.extra.baseUrl}/api/v1/categories`, {
        headers: {
          Authorization: `Bearer ${JwtService.accessToken}`,
        },
      })

    console.log("LALAL: ", res.data.length);
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
