import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { List, Switch, useTheme, Text } from "react-native-paper";
import { Text as RnText } from "../../../components";
import LogoutModal from "./components/LogoutModal";
import AutoTaskModal from "./components/AutoTaskModal";
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
      <View
        style={{
          backgroundColor: "white",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
          }}
        >
          My account
        </Text>
      </View>
      <View style={{ marginTop: 25 }}>
        <Text
          style={{
            marginBottom: 5,
            letterSpacing: 0.3,
            fontWeight: "700",
            color: theme.colors.secondary,
          }}
        >
          ACCOUNT INFOMATION
        </Text>

        {isLoading ? (
          <View style={{ marginBottom: 10 }}>
            <SkeletonBox height={30} width={"100%"} />
          </View>
        ) : (
          <List.Item
            style={{
              padding: 0,
              marginLeft: -7,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "white",
            }}
            titleStyle={{
              color: "#111827",
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={navigateToChangeEmail}
            title="Email"
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    marginBottom: 2,
                    paddingRight: 5,
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.secondary,
                  }}
                  type="h3"
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
            style={{
              padding: 0,
              marginLeft: -7,
              backgroundColor: "white",

              paddingBottom: 10,
            }}
            titleStyle={{
              color: "#111827",
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={navigateToEditPassword}
            title="Password"
            right={() => (
              <MaterialIcons size={24} name="keyboard-arrow-right" />
            )}
          />
        )}
        {isLoading ? (
          <View style={{ marginBottom: 10 }}>
            <SkeletonBox height={30} width={"100%"} />
          </View>
        ) : (
          <TouchableOpacity onPress={navigateToChangeTimezone}>
            <List.Item
              style={{
                padding: 0,
                marginLeft: -7,
                backgroundColor: "white",

                paddingBottom: 10,
              }}
              titleStyle={{
                color: "#111827",
                fontWeight: "700",
                fontSize: 18,
              }}
              title="Timezone"
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      marginBottom: 2,
                      paddingRight: 5,
                      fontSize: 16,
                      fontWeight: "600",
                      color: theme.colors.secondary,
                    }}
                    type="h3"
                  >
                    {Localization.timezone}
                  </Text>
                  <MaterialIcons size={24} name="keyboard-arrow-right" />
                </View>
              )}
            />
          </TouchableOpacity>
        )}

        <Text
          style={{
            marginTop: 20,
            letterSpacing: 0.3,
            fontWeight: "700",
            color: theme.colors.secondary,
          }}
        >
          APP SETTINGS
        </Text>

        <View>
          {isLoading ? (
            <View style={{ marginBottom: 10 }}>
              <SkeletonBox height={70} width={"100%"} />
            </View>
          ) : (
            <TouchableOpacity onPress={toggleAutoTaskModal}>
              <List.Item
                style={{
                  padding: 0,
                  marginLeft: -7,
                  backgroundColor: "white",
                }}
                titleStyle={{
                  color: "#111827",
                  fontWeight: "700",
                  fontSize: 18,
                }}
                title="Auto Move Tasks"
                right={() => (
                  <View
                    pointerEvents="none"
                    style={{ justifyContent: "center" }}
                  >
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
                  fontWeight: "500",
                  maxWidth: "95%",
                  color: theme.colors.secondary,
                }}
              >
                Automatically move all incompleted tasks to “today”.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ flexGrow: 1, marginTop: 10 }}>
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            letterSpacing: 0.6,
            fontWeight: "700",
            color: theme.colors.secondary,
          }}
        >
          APP INFOMATION
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#111827",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            App Version No.
          </Text>
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.secondary,
            }}
          >
            v0.2
          </Text>
        </View>
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
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onPress={handleLogout}
        onCancel={toggleLogoutModal}
      />
      <AutoTaskModal
        isVisible={isAutoTaskModalVisible}
        onPress={handleSubmitAutoTask}
        onCancel={handleCloseModal}
        isLoading={moveTasksApiResult.isLoading || updatePrefsResult.isLoading}
        isSuccess={moveTasksApiResult.isSuccess || updatePrefsResult.isLoading}
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
