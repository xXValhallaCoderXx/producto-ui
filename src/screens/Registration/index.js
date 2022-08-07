import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

const RegistrationScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>RegistrationScreen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Login')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RegistrationScreen;

