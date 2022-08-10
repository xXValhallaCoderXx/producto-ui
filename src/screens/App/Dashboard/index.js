import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Dashboard Screen!</Text>
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Registration")}
      /> */}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F0DB3",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DashboardScreen;
