import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, createTheme } from '@rneui/themed';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/Auth/Login";
import RegistrationScreen from "./src/screens/Auth/Register";
import AppScreens from "./src/screens/App";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});
const Stack = createNativeStackNavigator();




const theme = createTheme({
  lightColors: {
    primary: '#5048E5',
  },
  darkColors: {
    primary: '#5048E5',
  },
  components: {
    Button: {
      titleStyle: {
        color: 'red',
      },
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
            })}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="App" component={AppScreens} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
      </ThemeProvider>
     
    </SafeAreaProvider>
  );
}
