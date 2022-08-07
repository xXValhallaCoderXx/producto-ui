import { useState } from "react";
import axios from "axios";
import { Button, Card, Text, Input } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";

const LoginSection = ({ onClickDismissLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = () => {
    if (email && password) {
      axios
        .post(
          `http://49e4-2406-3003-2007-179f-8d3f-f4ac-c2b3-ac2e.ngrok.io/api/v1/auth/login`,
          {
            username: email,
            password: password,
          }
        )
        .then((response) => {
          console.log("RESPONSE: ", response)
          JwtService.setToken(response.data.access_token);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <KeyboardAvoidingView enabled>
      <Card style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            raised
            name="arrow-down"
            type="font-awesome"
            color="red"
            onPress={onClickDismissLogin}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.titleContainer} h2>
            Login
          </Text>
          <Input
            onChangeText={(value) => setEmail(value)}
            value={email}
            nativeID="email"
            placeholder="Enter your email..."
          />
          <Input
            onChangeText={(value) => setPassword(value)}
            value={password}
            nativeID="password"
            placeholder="Enter your password..."
          />
          <Button
            disabled={!email || !password}
            title="Submit"
            onPress={handleOnSubmit}
          />
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
  buttonContainer: {
    marginTop: 10,
  },
});

export default LoginSection;
