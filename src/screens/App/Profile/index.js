import { Fragment, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, useTheme } from "@rneui/themed";
import { Switch } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { useUserProfileQuery } from "../../../api/auth-api";
import { Text } from "../../../components";
import LogoutModal from "./components/LogoutModal";
import PasswordModal from "./components/PasswordModal";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isPasswordModalVisable, setIsPasswordModalVisable] = useState(false);
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const { data } = useUserProfileQuery({});

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisable(!isPasswordModalVisable);
  };

  const toggleSwitchAuto = () => {
    setToggleSwitch(!toggleSwitch);
  };

  const toggleAutoTaskModal = () => {
    console.log("lsl");
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem("@producto-jwt-token", "");
    setIsLogoutModalVisible(false);
    dispatch(toggleIsAuthenticated({ isAuthenticared: false }));
  };

  const handleChangePassword = () => {
    console.log("CHANGE pass")
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <View style={{ flex: 2 }}>
          <Text type="h2" color="black">
            {data?.email}
          </Text>
        </View>
        <View style={{ flex: 4 }}>
          <Text type="h4" color="secondary">
            ACCOUNT
          </Text>
          <TouchableOpacity onPress={togglePasswordModal}>
            <Text customStyle={{ marginTop: 16 }}>Change Password</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 6 }}>
          <Text type="h4" color="secondary">
            APP SETTINGS
          </Text>
          <TouchableOpacity
            onPress={toggleAutoTaskModal}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <View style={{ flex: 3 }}>
              <Text customStyle={{ marginTop: 16, marginBottom: 10 }}>
                Auto Move Tasks
              </Text>
              <Text type="h4" color="secondary">
                Automatically move all incompleted tasks to “today”.
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Switch onChange={toggleSwitchAuto} value={toggleSwitch} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 8 }}>
          <Button
            type="clear"
            TouchableComponent={TouchableOpacity}
            titleStyle={{ color: theme.colors.secondary, fontSize: 16 }}
            containerStyle={{ padding: 0 }}
            buttonStyle={styles.buttonStyle}
            onPress={toggleLogoutModal}
          >
            <MaterialIcons
              style={styles.iconStyle}
              onPress={toggleLogoutModal}
              name="logout"
              color={theme.colors.secondary}
            />
            Logout
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <Text
            type="h4"
            color="secondary"
            customStyle={{ textAlign: "center" }}
          >
            v0.0.1
          </Text>
        </View>
      </View>
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onPress={handleLogout}
        onCancel={toggleLogoutModal}
      />
       <PasswordModal
        isVisible={isPasswordModalVisable}
        onPress={handleChangePassword}
        onCancel={togglePasswordModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    // justifyContent: "space-between",
    paddingTop: 55,
    paddingLeft: 30,
    paddingRight: 30,
  },
  container: {
    display: "flex",
    flex: 1,
    // justifyContent: "space-between",
    // alignItems: "center",
    // marginTop: 50,

    flexDirection: "column",
  },
  iconStyle: {
    paddingRight: 5,
    fontSize: 20,
    paddingTop: 2,
    paddingRight: 30,
  },
  buttonStyle: {
    display: "flex",
    justifyContent: "flex-start",
    padding: 0,
    marginLeft: -5,
  },
});

export default ProfileScreen;
