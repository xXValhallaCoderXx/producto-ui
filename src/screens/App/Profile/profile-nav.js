import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import LayoutView from "../../../components/LayoutView";
const Stack = createNativeStackNavigator();

const Accounts = ({ navigation }) => {
  const handleChangePassword = () => {
    navigation.navigate("EditAccount", {title: "Change Password"});
  };

  const handleChangeEmail = () => {
    navigation.navigate("EditAccount", {title: "Change Email"});
  };
  return (
    <LayoutView>
      <Text onPress={handleChangePassword} style={{ marginTop: 20 }}>
        Change Password
      </Text>
      <Text onPress={handleChangeEmail} style={{ marginTop: 40 }}>
        Change Email
      </Text>
    </LayoutView>
  );
};

const EditScreen = ({ route, navigation }) => {
    const {title} = route.params;
    useEffect(()=>{
        navigation.setOptions({ title })
    },[])

  const handleOnPress = () => {
    navigation.navigate("Accounts");
  };
  return (
    <LayoutView>
      <Text onPress={handleOnPress} style={{ marginTop: 20 }}>
        Edit Screen
      </Text>
    </LayoutView>
  );
};

const ProfileScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => {
        return {
            headerStyle: {
                backgroundColor: "red",
            },
          headerShown: route.name === "Accounts" ? false : true,
        };
      }}
    >
      <Stack.Screen name="Accounts" component={Accounts} />
      <Stack.Screen name="EditAccount" component={EditScreen} />
    </Stack.Navigator>
  );
};

export default ProfileScreens;
