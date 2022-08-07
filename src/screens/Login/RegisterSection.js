import { useEffect } from "react";
import { Button, Card, Text, Input } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";

const RegisterSection = ({ onClickDismiss }) => {
  return (
    <KeyboardAvoidingView enabled>
      <Card style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            raised
            name="arrow-down"
            type="font-awesome"
            color="red"
            onPress={onClickDismiss}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.titleContainer} h2>
            Registration
          </Text>
          <Input placeholder="Enter your email..." />
          <Input placeholder="Enter your password..." />
          <Input placeholder="Confirm your password..." />
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: -50,
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: 10,
  },
  contentContainer: {
    padding: 10,
  },
});

export default RegisterSection;
