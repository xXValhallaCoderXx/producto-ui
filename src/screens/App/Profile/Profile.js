import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import { Text as RnText } from "../../../components";
import LogoutModal from "./components/LogoutModal";
import AutoTaskModal from "./components/AutoTaskModal";
import { Button, Switch } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme, Text } from "react-native-paper";
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

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [moveTasksApi, moveTasksApiResult] = useMoveSpecificTasksMutation();
  const [updatePrefsApi, updatePrefsApiResult] = useUpdatePrefsMutation();
  const [isAutoTaskModalVisible, setisAutoTaskModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const { data } = useGetProfileQuery({});
  const { colors } = useTheme();

  //   useEffect(() => {
  //     if (updatePasswordApiResult.isSuccess) {
  //       ToastAndroid.show(`Password updated!`, ToastAndroid.SHORT);
  //     }
  //     if (updatePrefsApiResult.isSuccess) {
  //       ToastAndroid.show(`Auto move tasks updated!`, ToastAndroid.SHORT);
  //     }
  //     if (moveTasksApiResult.isSuccess) {
  //       setisAutoTaskModalVisible(false);
  //       ToastAndroid.show(`Tasks have been moved!`, ToastAndroid.SHORT);
  //     }

  //     if (updateEmailApiResult.isSuccess) {
  //       setIsChangeEmailModalVisable(false);
  //       ToastAndroid.show(`Email updated!`, ToastAndroid.SHORT);
  //     }
  //     if (updateEmailApiResult.isError) {
  //       ToastAndroid.show(`Error updating email!`, ToastAndroid.SHORT);
  //     }
  //   }, [
  //     updatePasswordApiResult,
  //     updatePrefsApiResult,
  //     moveTasksApiResult,
  //     updateEmailApiResult,
  //   ]);

  useEffect(() => {
    if (data?.prefs?.false) {
      setisAutoTaskModalVisible(true);
    }
  }, [!data?.prefs?.autoMove]);

  const toggleLogoutModal = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  //   const togglePasswordModal = () => {
  //     setIsPasswordModalVisable(!isPasswordModalVisable);
  //   };

  //   const toggleChangeEmailModal = () => {
  //     setIsChangeEmailModalVisable(!isChangeEmailModalVisable);
  //   };

  const toggleAutoTaskModal = async () => {
    if (!data?.prefs?.autoMove) {
      setisAutoTaskModalVisible(true);
    }
    await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
  };

  const handleCloseModal = () => {
    setisAutoTaskModalVisible(false);
  };

  //   const toggleSwitchAuto = async () => {
  //     await updatePrefsApi({ autoMove: !data?.prefs?.autoMove });
  //     // setToggleSwitch(!toggleSwitch);
  //   };

  //   const handleChangeEmail = async (values) => {
  //     try {
  //       // unwrapping will cause data to resolve, or an error to be thrown, and will narrow the types
  //       const result = await updateEmailApi({
  //         password: values.password,
  //         email: values.email,
  //       });

  //       const { tokens } = result.data;
  //       console.log("RESULT: ", result.data);
  //       await SecureStore.setItemAsync(JWT_KEY_STORE, tokens.accessToken);
  //       await SecureStore.setItemAsync(
  //         REFRESH_JWT_KEY_STORE,
  //         tokens.refreshToken
  //       );

  //       // refetch(); // you should most likely just use tag invalidation here instead of calling refetch
  //     } catch (error) {
  //       console.log("ERROR: ", error);
  //     }
  //   };

  const handleLogout = async () => {
    await SecureStore.setItemAsync(JWT_KEY_STORE, "");
    await SecureStore.setItemAsync(REFRESH_JWT_KEY_STORE, "");
    setIsLogoutModalVisible(false);
    dispatch(toggleIsAuthenticated(false));
  };

  //   const handleChangePassword = async (values) => {
  //     await updatePasswordApi({
  //       oldPassword: values.oldPassword,
  //       newPassword: values.newPassword,
  //     });
  //   };

  const handleSubmitAutoTask = async (dates) => {
    const to = format(new Date(), "yyyy-MM-dd");
    await moveTasksApi({ tasks: Object.keys(dates), to });
  };

  const navigateToEditPassword = () => {
    navigation.navigate("UpdatePassword", { title: "Change Password" });
  };

  const navigateToChangeEmail = () => {
    navigation.navigate("UpdateEmail", { title: "Change Email", email: data?.email });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <View style={{ flex: 5 }}>
          <RnText customStyle={{marginBottom: 10}} type="h4"  color="secondary">
            ACCOUNT
          </RnText>

          <List.Item
            titleStyle={{
          
              color: colors.primary,
              fontWeight: "600",
            }}
        
            onPress={navigateToChangeEmail}
      
            title="Email"
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginBottom: 2, paddingRight: 5 }} type="h3" color="black">
                  {data?.email}
                </Text>
                <MaterialIcons size={24} name="keyboard-arrow-right" />
              </View>
            )}
          />
          <List.Item
            titleStyle={{
        
              color: colors.primary,
              fontWeight: "600",
            }}
       
            onPress={navigateToEditPassword}
            title="Password"
            right={() => (
              <MaterialIcons size={24} name="keyboard-arrow-right" />
            )}
          />
        </View>
        <View style={{ flex: 9 }}>
          <RnText type="h4" color="secondary" customStyle={{marginBottom: 20}}>
            APP SETTINGS
          </RnText>


          <List.Item
            titleStyle={{
        
              color: colors.primary,
              fontWeight: "600",
            }}
            onPress={navigateToChangeEmail}
 
            title="Timezone"
            right={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                
                <Text style={{ marginBottom: 2, paddingRight: 5 }} type="h3" color="black">
                {Localization.timezone}
                </Text>
                <MaterialIcons size={24} name="keyboard-arrow-right" />
              </View>
            )}
          />
               <List.Item
            titleStyle={{
        
              color: colors.primary,
              fontWeight: "600",
            }}
            onPress={navigateToChangeEmail}
     
            title="Auto Move Tasks"
            description="Automatically move all incompleted tasks to “today”."
            descriptionStyle={{maxWidth: 240, marginLeft: -2, marginTop: 2}}
            right={() => (
               <View style={{justifyContent: "center"}}>
                 <Switch
                onChange={toggleAutoTaskModal}
                value={data?.prefs?.autoMove}
              />
              </View>
            )}
          />
          {/* <TouchableOpacity
            onPress={toggleAutoTaskModal}
            style={{
              display: "flex",
              // backgroundColor: "red",
              flexDirection: "row",
              alignContent: "space-between",
            }}
          >
            <View style={{ flex: 12 }}>
              <RnText
                color="dark"
                customStyle={{ marginTop: 16, marginBottom: 10 }}
              >
                Auto Move Tasks
              </RnText>
              <View style={{ maxWidth: 220 }}>
                <RnText type="h4" color="secondary">
                  Automatically move all incompleted tasks to “today”.
                </RnText>
              </View>
            </View>
            <View
              style={{
                flex: 2,
                padding: 10,
                justifyContent: "center",
              }}
            >
              <Switch
                onChange={toggleAutoTaskModal}
                value={data?.prefs?.autoMove}
              />
            </View>
          </TouchableOpacity> */}
          {/* <RnText style={{ flex: 3 }}>
            <RnText
              color="dark"
              customStyle={{ marginTop: 16, marginBottom: 10 }}
            >
              Timezone
            </RnText>
            <RnText type="h4" color="secondary">
             
            </RnText>
          </RnText> */}
        </View>

        <View style={{ flex: 5 }}>
          <Button
            type="clear"
            TouchableComponent={TouchableOpacity}
            titleStyle={{ color: colors.secondary, fontSize: 16 }}
            containerStyle={{ padding: 0 }}
            buttonStyle={styles.buttonStyle}
            onPress={toggleLogoutModal}
          >
            <MaterialIcons
              style={styles.iconStyle}
              onPress={toggleLogoutModal}
              name="logout"
              color={colors.secondary}
            />
            Logout
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <RnText
            type="h4"
            color="secondary"
            customStyle={{ textAlign: "center" }}
          >
            v0.0.1
          </RnText>
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
      {/* <PasswordModal
        isVisible={isPasswordModalVisable}
        onPress={handleChangePassword}
        onCancel={togglePasswordModal}
        isLoading={updatePasswordApiResult.isLoading}
        isSuccess={updatePasswordApiResult.isSuccess}
        serverError={updatePasswordApiResult.error?.data.message}
      />
      <ChangeEmailModal
        isVisible={isChangeEmailModalVisable}
        onPress={handleChangeEmail}
        onCancel={toggleChangeEmailModal}
        isLoading={updateEmailApiResult.isLoading}
        isSuccess={updateEmailApiResult.isSuccess}
        serverError={updateEmailApiResult.error?.data.message}
      /> */}
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
