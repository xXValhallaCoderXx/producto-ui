import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { List, Switch, Button, useTheme, Text } from "react-native-paper";
// import { Text as RnText } from "../../../components";
import LogoutModal from "./components/LogoutModal";
// import AutoTaskModal from "./components/AutoTaskModal";
import SkeletonBox from "../../../components/SkeletonBox";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  JWT_KEY_STORE,
  REFRESH_JWT_KEY_STORE,
} from "../../../shared/constants";

import { useMoveSpecificTasksMutation } from "../../../api/task-api";
import { toggleIsAuthenticated } from "../../../shared/slice/global-slice";
import {
  useGetProfileQuery,
  useUpdatePrefsMutation,
} from "../../../api/user-api";
import { useToast } from "react-native-toast-notifications";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [updatePrefsApi, updatePrefsResult] = useUpdatePrefsMutation();
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { data, isLoading } = useGetProfileQuery({});
  const { colors } = useTheme();

  useEffect(() => {
    if (data?.prefs?.false) {
      setisAutoTaskModalVisible(true);
    }
  }, [!data?.prefs?.autoMove]);

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const toggleAutoTaskModal = async () => {
    setisAutoTaskModalVisible(!isAutoTaskModalVisible);
    // if (!data?.prefs?.autoMove) {

    // }

    // toast.show("", {
    //   type: "success",
    //   duration: 2500,
    //   offset: 100,
    //   animationType: "zoom-in",
    //   placement: "top",
    //   title: "Auto Tasks Updated!",
    // });
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
    await moveTasksApi({ tasks: Object.keys(dates), to });
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
    setisAutoTaskModalVisible(false);
    toast.show("", {
      type: "success",
      duration: 2500,
      offset: 100,
      animationType: "zoom-in",
      placement: "top",
      title: "Tasks have been moved!",
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
      <View style={styles.container}>
        <View style={{ flex: 5 }}>
          <Text customStyle={{ marginBottom: 10 }} type="h4" color="secondary">
            ACCOUNT
          </Text>

          {isLoading ? (
            <View style={{ marginBottom: 10 }}>
              <SkeletonBox height={30} width={"100%"} />
            </View>
          ) : (
            <List.Item
              titleStyle={{
                color: colors.black,
                fontWeight: "600",
              }}
              onPress={navigateToChangeEmail}
              title="Email"
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{ marginBottom: 2, paddingRight: 5 }}
                    type="h3"
                    color="black"
                  >
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
              titleStyle={{
                color: colors.black,
                fontWeight: "600",
              }}
              onPress={navigateToEditPassword}
              title="Password"
              right={() => (
                <MaterialIcons size={24} name="keyboard-arrow-right" />
              )}
            />
          )}
        </View>
        <View style={{ flex: 9 }}>
          <Text type="h4" color="secondary" customStyle={{ marginBottom: 20 }}>
            APP SETTINGS
          </Text>

          {isLoading ? (
            <View style={{ marginBottom: 10 }}>
              <SkeletonBox height={30} width={"100%"} />
            </View>
          ) : (
            <List.Item
              titleStyle={{
                color: colors.black,
                fontWeight: "600",
              }}
              onPress={navigateToChangeTimezone}
              title="Timezone"
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{ marginBottom: 2, paddingRight: 5 }}
                    type="h3"
                    color="black"
                  >
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
            <List.Item
              titleStyle={{
                color: colors.black,
                fontWeight: "600",
              }}
              onPress={toggleAutoTaskModal}
              title="Auto Move Tasks"
              description="Automatically move all incompleted tasks to “today”."
              descriptionStyle={{ maxWidth: 240, marginTop: 2 }}
              right={() => (
                <View style={{ justifyContent: "center" }}>
                  <Switch
                    onChange={toggleAutoTaskModal}
                    value={data?.prefs?.autoMove}
                  />
                </View>
              )}
            />
          )}
        </View>

        <View style={{ flex: 5, alignItems: "flex-start" }}>
          <Button
            type="text"
            TouchableComponent={TouchableOpacity}
            labelStyle={{ color: colors.secondary, fontSize: 26 }}
            onPress={toggleLogoutModal}
            icon={"door"}
          >
            <Text style={{ justifyContent: "center", fontSize: 16 }}>
              Logout
            </Text>
          </Button>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
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
      {/* 
      <AutoTaskModal
        isVisible={isAutoTaskModalVisible}
        onPress={handleSubmitAutoTask}
        onCancel={handleCloseModal}
        isLoading={moveTasksApiResult.isLoading}
        isSuccess={moveTasksApiResult.isSuccess}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    paddingTop: 55,
    paddingLeft: 30,
    paddingRight: 30,
  },
  container: {
    display: "flex",
    flex: 1,
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
