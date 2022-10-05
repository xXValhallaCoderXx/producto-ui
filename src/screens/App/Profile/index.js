import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import { format } from "date-fns";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from "react-native";
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
    if (moveTasksApiResult.isSuccess) {
      setisAutoTaskModalVisible(false);
      ToastAndroid.show(`Tasks have been moved!`, ToastAndroid.SHORT);
    }
  }, [updatePasswordApiResult, updatePrefsApiResult, moveTasksApiResult]);

  useEffect(() => {
      if(data?.prefs?.false){
        setisAutoTaskModalVisible(true)
      }
  }, [!data?.prefs?.autoMove])

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalVisable(!isPasswordModalVisable);
  };

  const toggleAutoTaskModal = async () => {

    if(!data?.prefs?.autoMove){
      setisAutoTaskModalVisible(true);
    }
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
  };

  const handleCloseModal = () => {
    setisAutoTaskModalVisible(false);
  }

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
    const to = format(new Date(), "yyyy-MM-dd");
    await moveTasksApi({ tasks: Object.keys(dates), to });
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
        <View style={{ flex: 9 }}>
          <Text type="h4" color="secondary">
            APP SETTINGS
          </Text>
          <TouchableOpacity
            onPress={toggleAutoTaskModal}
            style={{
              display: "flex",
              // backgroundColor: "red",
              flexDirection: "row",
              alignContent: "space-between",
            }}
          >
            <View style={{ flex: 12 }}>
              <Text
                color="dark"
                customStyle={{ marginTop: 16, marginBottom: 10 }}
              >
                Auto Move Tasks
              </Text>
              <View style={{ maxWidth: 220 }}>
                <Text type="h4" color="secondary">
                  Automatically move all incompleted tasks to “today”.
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 2,
                padding: 10,
                justifyContent: "center",
              }}
            >
              <Switch value={data?.prefs?.autoMove} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 3 }}>
            <Text
              color="dark"
              customStyle={{ marginTop: 16, marginBottom: 10 }}
            >
              Timezone
            </Text>
            <Text type="h4" color="secondary">
              {Localization.timezone}
            </Text>
          </View>
        </View>

        <View style={{ flex: 5 }}>
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
        onCancel={handleCloseModal}
        isLoading={moveTasksApiResult.isLoading}
        isSuccess={moveTasksApiResult.isSuccess}
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
