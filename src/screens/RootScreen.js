import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileRoute from "./Profile";
import LoginScreen from "./Auth/Login/Login";
import RegisterScreen from "./Auth/Register/Register";
import HomeScreen from "./Home";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../api/user-api";
import LoadingScreen from "../layouts/LoadingScreen";
import AnimatedBottomNavButton from "../components/AnimatedBottomNavButton"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const RootScreens = () => {
  const isInit = useSelector((state) => state.global.init);
  const isAuthenticated = useSelector((state) => state.global.isAuthenticated);
  const {isLoading} = useGetProfileQuery();

  if (!isInit && isLoading) {
    return <LoadingScreen />;
  }

  if (isInit && isAuthenticated) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
          },
          tabBarButton: AnimatedBottomNavButton,
        })}
      >
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="profile" component={ProfileRoute} />
      </Tab.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default RootScreens;
