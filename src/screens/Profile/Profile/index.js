import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
// import * as Localization from "expo-localization";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { List, Switch, useTheme, Text } from "react-native-paper";
import SkeletonBox from "../../../components/SkeletonBox";
import ListItem from "../../../components/SettingsListItem";
import LogoutModal from "./components/LogoutModal";
import MoveTaskModal from "../../../components/MoveTasksModal";

import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";
import { useMoveSpecificTasksMutation } from "../../../api/tasks-api";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  useGetProfileQuery,
  useUpdatePrefsMutation,
} from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const toast = useToast();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [updatePrefsApi, updatePrefsResult] = useUpdatePrefsMutation();
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { data, isLoading } = useGetProfileQuery({});

  useEffect(() => {
    if (data?.prefs?.false) {
      setisAutoTaskModalVisible(true);
    }
  }, [!data?.prefs?.autoMove]);

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const toggleAutoTaskModal = () => {
    setisAutoTaskModalVisible(!isAutoTaskModalVisible);
  };

  const handleCloseModal = () => {
    setisAutoTaskModalVisible(false);
  };

  const handleLogout = async () => {
    await SecureStore.setItemAsync(JWT_KEY_STORE, "");
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
    setIsLogoutModalVisible(false);
    dispatch(toggleIsAuthenticated(false));
  };

  const handleSubmitAutoTask = async (dates) => {
    const to = format(new Date(), "yyyy-MM-dd");
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
    await moveTasksApi({ tasks: Object.keys(dates), to });
    setisAutoTaskModalVisible(false);
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: "Auto task setting updated!",
    });
  };

  const navigateToEditPassword = () => {
    navigation.navigate("UpdatePassword", { title: "Change Password" });
  };

  const navigateToChangeEmail = () => {
    navigation.navigate("UpdateEmail", {
      title: "Change Email",
      email: data?.email,
    });
  };

  const navigateToChangeTimezone = () => {
    navigation.navigate("UpdateTimezone", {
      title: "Change Timezone",
      email: data?.email,
    });
  };

  return (
    <View style={styles.screenContainer}>
      <Text
        variant="headlineMedium"
        style={{ fontWeight: "700", marginBottom: 20 }}
      >
        My account
      </Text>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.secondary, fontWeight: "700" }}
      >
        ACCOUNT INFOMATION
      </Text>
      <View style={{ height: 230 }}>
        <View style={{ marginBottom: 15, marginTop: 10 }}>
          {isLoading ? (
            <SkeletonBox height={50} width={"100%"} />
          ) : (
            <ListItem
              title={"E-mail"}
              data={data?.email}
              onPress={navigateToChangeEmail}
            />
          )}
        </View>
        <View style={{ marginBottom: 15 }}>
          {isLoading ? (
            <SkeletonBox height={50} width={"100%"} />
          ) : (
            <ListItem
              title={"Password"}
              data=""
              onPress={navigateToEditPassword}
            />
          )}
        </View>
        <View style={{ marginBottom: 30 }}>
          {isLoading ? (
            <SkeletonBox height={50} width={"100%"} />
          ) : (
            <ListItem
              title={"Timezone"}
              data="Asia/Singapore"
              onPress={navigateToChangeTimezone}
            />
          )}
        </View>
      </View>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.secondary, fontWeight: "700" }}
      >
        APP SETTINGS
      </Text>
      <TouchableOpacity
        style={{ marginBottom: 20 }}
        onPress={toggleAutoTaskModal}
      >
        <List.Item
          style={{
            padding: 0,
            marginLeft: -7,
            backgroundColor: "white",
          }}
          titleStyle={{
            color: "#111827",
            fontWeight: "500",
            fontSize: 18,
          }}
          title="Auto Move Tasks"
          right={() => (
            <View pointerEvents="none" style={{ justifyContent: "center" }}>
              <Switch
                // onChange={toggleAutoTaskModal}
                value={data?.prefs?.autoMove}
              />
            </View>
          )}
        />
        <Text
          color="secondary"
          type="h4"
          style={{
            marginTop: 5,
            paddingLeft: 10,
            fontWeight: "500",
            maxWidth: "80%",
            color: theme.colors.secondary,
          }}
        >
          Automatically move all incompleted tasks to “today”.
        </Text>
      </TouchableOpacity>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.secondary, fontWeight: "700" }}
      >
        APP SETTINGS
      </Text>
      <View style={{ marginBottom: 30 }}>
        <ListItem
          hideArrow
          title={"App Version"}
          data="v2.1"
          onPress={() => null}
        />
      </View>
      <TouchableOpacity
        onPress={toggleLogoutModal}
        style={{
          backgroundColor: "white",
          marginBottom: 30,
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: theme.colors.error, fontWeight: "600", fontSize: 20 }}
        >
          Log out
        </Text>
      </TouchableOpacity>
      <MoveTaskModal
        isLoading={moveTasksApiResult.isLoading}
        isVisible={isAutoTaskModalVisible}
        onPress={handleSubmitAutoTask}
        onCancel={handleCloseModal}
        date={new Date()}
      />
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onPress={handleLogout}
        onCancel={toggleLogoutModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 30,
  },
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginTop: 30,
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
