import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, BackHandler, Alert } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Text, Button, useTheme } from "@rneui/themed";
import { Dialog } from "@rneui/themed";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text h4 style={{ color: theme.colors.primary }}>
            Blooper
          </Text>
          <Text h4>'s Profile</Text>
        </View>
      </View>

      <View style={{ paddingLeft: 30, marginBottom: 50 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons onPress={toggleDialog} name="logout" color="#D14343" />
          <Text
            onPress={toggleDialog}
            h5
            style={{ paddingLeft: 10, color: "#D14343" }}
          >
            Logout
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Confirm" />
        <Text h5>Are you sure you want to logout?</Text>

        <Dialog.Actions>
          <Button
            title="Cancel"
            color={theme.colors.primary}
            onPress={toggleDialog}
            type="clear"
          />
          <Button
            onPress={() => BackHandler.exitApp()}
            title="Log out"
            titleStyle={{ color: "#D14343" }}
            type="clear"
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
  },
});

export default ProfileScreen;
