import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { List, Switch, Button, useTheme, Text } from "react-native-paper";
import AutoTaskModal from "./components/AutoTaskModal";
import SkeletonBox from "../../../components/SkeletonBox";
import ConfirmationModal from "../../../components/ConfirmationModal";
import logoutIcon from "../../../assets/images/logout.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { api } from "../../../api";
import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
  AUTOTASK_ACTIVE_FROM,
} from "../../../shared/constants";

import { useMoveSpecificTasksMutation } from "../../../api/task-api";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  useGetProfileQuery,
  useUpdatePrefsMutation,
  useLazyDeleteAccountQuery,
} from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [autotaskDate, setAutotaskDate] = useState("");
  const [triggerDeleteAccount, deleteAccountResult] =
    useLazyDeleteAccountQuery();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [updatePrefsApi, updatePrefsResult] = useUpdatePrefsMutation();
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { data, isLoading } = useGetProfileQuery();

  const { colors } = useTheme();

  useEffect(() => {
    if (data?.prefs?.false) {
      setisAutoTaskModalVisible(true);
    }
  }, [!data?.prefs?.autoMove]);

  useEffect(() => {
    if (deleteAccountResult.isSuccess) {
      dispatch(api.util.resetApiState());
      dispatch(toggleIsAuthenticated(false));
      setIsDeleteModalVisible(false);
    } else if (deleteAccountResult.isError) {
      toast.show("", {
        type: "error",
        duration: 2500,
        offset: 100,
        animationType: "zoom-in",
        placement: "top",
        title: "Sorry, an error occured",
      });
    }
  }, [deleteAccountResult]);

  useEffect(() => {
    checkAutotaskDate();
  }, []);

  const checkAutotaskDate = async () => {
    const autotaskStarted = await SecureStore.getItemAsync(
      AUTOTASK_ACTIVE_FROM
    );
    setAutotaskDate(autotaskStarted);
  };

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const toggleAutoTaskModal = async () => {
    setisAutoTaskModalVisible(!isAutoTaskModalVisible);
  };

  const handleCloseModal = () => {
    setisAutoTaskModalVisible(false);
  };

  const handleLogout = async () => {
    await SecureStore.setItemAsync(JWT_KEY_STORE, "");
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
    dispatch(api.util.resetApiState());
    setIsLogoutModalVisible(false);
    dispatch(toggleIsAuthenticated(false));
  };

  const handleDeleteUser = async () => {
    triggerDeleteAccount();
    await SecureStore.setItemAsync(JWT_KEY_STORE, "");
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
  };

  const handleSubmitAutoTask = async (dates) => {
    const to = new Date().toISOString();
    await moveTasksApi({ tasks: Object.keys(dates), to });
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
    setisAutoTaskModalVisible(false);
    await SecureStore.setItemAsync(AUTOTASK_ACTIVE_FROM, String(to));
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: data?.prefs?.autoMove
        ? "Autotasks disabled!"
        : "Autotasks enabled!",
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

  const listTitleStyle = {
    color: colors.black,
    fontWeight: "600",
  };

  return (
    <View style={styles.screenContainer}>
      <View>
        <Text style={styles.titleStyle}>ACCOUNT INFORMATION</Text>

        {isLoading ? (
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <SkeletonBox height={30} width={"100%"} />
          </View>
        ) : (
          <List.Item
            titleStyle={listTitleStyle}
            style={styles.listItem}
            onPress={navigateToChangeEmail}
            title="Email"
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text type="h3" color="black">
                  {data?.email}
                </Text>
                <MaterialIcons size={24} name="keyboard-arrow-right" />
              </View>
            )}
          />
        )}
        {isLoading ? (
          <View style={{ marginBottom: 10 }}>
            <SkeletonBox height={30} width={"100%"} />
          </View>
        ) : (
          <List.Item
            titleStyle={listTitleStyle}
            style={styles.listItem}
            onPress={navigateToEditPassword}
            title="Password"
            right={() => (
              <MaterialIcons size={24} name="keyboard-arrow-right" />
            )}
          />
        )}
      </View>
      <View style={{ marginTop: 25 }}>
        <Text style={styles.titleStyle}>APP SETTINGS</Text>

        {isLoading ? (
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <SkeletonBox height={30} width={"100%"} />
          </View>
        ) : (
          <List.Item
            titleStyle={listTitleStyle}
            style={styles.listItem}
            onPress={navigateToChangeTimezone}
            title="Timezone"
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text type="h3" color="black">
                  {Localization.timezone}
                </Text>
                <MaterialIcons size={24} name="keyboard-arrow-right" />
              </View>
            )}
          />
        )}

        {isLoading ? (
          <View style={{ marginBottom: 10 }}>
            <SkeletonBox height={70} width={"100%"} />
          </View>
        ) : (
          <View>
            <List.Item
              titleStyle={listTitleStyle}
              onPress={toggleAutoTaskModal}
              title="Auto-move tasks"
              style={styles.listItem}
              description="Automatically move all incompleted tasks to “today”."
              descriptionStyle={{ maxWidth: "80%", marginTop: 2 }}
              right={() => (
                <View
                  pointerEvents="none"
                  style={{ justifyContent: "center", paddingRight: 5 }}
                >
                  <Switch value={data?.prefs?.autoMove} />
                </View>
              )}
            />
            {data?.prefs?.autoMove && autotaskDate && (
              <Text style={{ paddingLeft: 23, marginTop: -5 }}>
                Active From: {autotaskDate}
              </Text>
            )}
          </View>
        )}
      </View>

      <List.Item
        titleStyle={listTitleStyle}
        style={{ ...styles.listItem, marginTop: 20 }}
        onPress={navigateToChangeEmail}
        title="App version no."
        right={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 10,
            }}
          >
            <Text type="h3" color="black">
              v1.0.2
            </Text>
          </View>
        )}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 0.2, justifyContent: "center" }}>
          <Button
            type="text"
            TouchableComponent={TouchableWithoutFeedback}
            style={{ width: "100%", borderRadius: 1 }}
            contentStyle={{
              justifyContent: "flex-start",
              paddingLeft: 15,
              paddingBottom: 5,
              paddingTop: 5,
            }}
            labelStyle={{
              color: colors.secondary,
              fontSize: 18,
              paddingLeft: 15,
            }}
            onPress={toggleLogoutModal}
            icon={logoutIcon}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Logout
            </Text>
          </Button>
        </View>
        <View style={{ flex: 0.9, justifyContent: "center" }}>
          <Button
            type="text"
            TouchableComponent={TouchableWithoutFeedback}
            style={{ width: "100%", borderRadius: 1 }}
            contentStyle={{
              justifyContent: "flex-start",
              paddingLeft: 15,
              paddingBottom: 5,
              paddingTop: 5,
            }}
            labelStyle={{
              color: colors.error,
              fontSize: 18,
            }}
            onPress={toggleDeleteModal}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.error,
              }}
            >
              Delete account
            </Text>
          </Button>
        </View>
      </View>

      <ConfirmationModal
        isVisible={isLogoutModalVisible}
        title="Log out"
        description="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={toggleLogoutModal}
        confirmLabel="Log out"
      />
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete account"
        description="If you delete your account, all of your tasks will also be removed"
        onConfirm={handleDeleteUser}
        onCancel={toggleDeleteModal}
        confirmLabel="Delete"
      />

      <AutoTaskModal
        isVisible={isAutoTaskModalVisible}
        isAutotaskActive={data?.prefs?.autoMove}
        onPress={handleSubmitAutoTask}
        onCancel={handleCloseModal}
        isLoading={moveTasksApiResult.isLoading || updatePrefsResult.isLoading}
        isSuccess={updatePrefsResult.isSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 35,
  },
  titleStyle: {
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 23,
  },
  listItem: {
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default ProfileScreen;
