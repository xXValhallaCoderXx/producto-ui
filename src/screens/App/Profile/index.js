import { useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { StyleSheet, View, BackHandler } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Text, Button, useTheme } from "@rneui/themed";
import { Dialog } from "@rneui/themed";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    setVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Login" }],
      })
    );
    BackHandler.exitApp();
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
        <Button
          type="clear"
          color={theme.colors.primary}
          titleStyle={{ color: "#D14343" }}
          buttonStyle={{ display: "flex", justifyContent: "flex-start" }}
          onPress={toggleDialog}
        >
          <MaterialIcons
            style={{ paddingRight: 5 }}
            onPress={toggleDialog}
            name="logout"
            color="#D14343"
          />
          Logout
        </Button>
      </View>
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Title title="Confirm" />
        <Text h5>Are you sure you want to logout?</Text>

        <Dialog.Actions>
          <Button
            onPress={handleLogout}
            title="Log out"
            titleStyle={{ color: "#D14343" }}
            type="clear"
          />
          <Button
            title="Cancel"
            color={theme.colors.primary}
            onPress={toggleDialog}
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
