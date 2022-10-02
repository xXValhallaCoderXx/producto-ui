import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { JWT_KEY_STORE, REFRESH_JWT_KEY_STORE } from "../../../shared/constants";
import { useDispatch } from "react-redux";
import { StyleSheet, View, TouchableOpacity, ToastAndroid } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, useTheme, Switch } from "@rneui/themed";
import { useGetProfileQuery } from "../../../api/user-api";
import { Text } from "../../../components";
import LogoutModal from "./components/LogoutModal";
import PasswordModal from "./components/PasswordModal";
import AutoTaskModal from "./components/AutoTaskModal";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import { useMoveSpecificTasksMutation } from "../../../api/task-api";
import {
  useUpdatePrefsMutation,
  useUpdatePasswordMutation,
} from "../../../api/user-api";

const ProfileScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [updatePrefsApi, updatePrefsApiResult] = useUpdatePrefsMutation();
  const [updatePasswordApi, updatePasswordApiResult] =
    useUpdatePasswordMutation();
  const [isPasswordModalVisable, setIsPasswordModalVisable] = useState(false);
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { data } = useGetProfileQuery({});

  useEffect(() => {
    if (updatePasswordApiResult.isSuccess) {
      ToastAndroid.show(`Password updated!`, ToastAndroid.SHORT);
    }
    if (updatePrefsApiResult.isSuccess) {
      ToastAndroid.show(`Auto move tasks updated!`, ToastAndroid.SHORT);
    }
  }, [updatePasswordApiResult, updatePrefsApiResult]);

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisable(!isPasswordModalVisable);
  };

  const toggleAutoTaskModal = () => {
    setisAutoTaskModalVisible(!isAutoTaskModalVisible);
  };

  const toggleSwitchAuto = async () => {
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
    // setToggleSwitch(!toggleSwitch);
  };

  const handleLogout = async () => {
    await SecureStore.setItemAsync(JWT_KEY_STORE, "");
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
    setIsLogoutModalVisible(false);
    dispatch(toggleIsAuthenticated(false));
  };

  const handleChangePassword = async (values) => {
    await updatePasswordApi({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  const handleSubmitAutoTask = async (dates) => {
    await moveTasksApi({ tasks: Object.keys(dates) });
  };

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
              <Switch
                onChange={toggleSwitchAuto}
                value={data?.prefs?.autoMove}
              />
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
      <AutoTaskModal
        isVisible={isAutoTaskModalVisible}
        onPress={handleSubmitAutoTask}
        onCancel={toggleAutoTaskModal}
        isLoading={updatePrefsApiResult.isLoading}
        isSuccess={updatePrefsApiResult.isSuccess}
      />
      <PasswordModal
        isVisible={isPasswordModalVisable}
        onPress={handleChangePassword}
        onCancel={togglePasswordModal}
        isLoading={updatePasswordApiResult.isLoading}
        isSuccess={updatePasswordApiResult.isSuccess}
        serverError={updatePasswordApiResult.error?.data.message}
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
