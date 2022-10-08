import { useEffect } from "react";
import { Text } from "react-native";
import LayoutView from "../../../components/LayoutView";

const EditPassword = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: "Update Password" });
  }, []);

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

export default EditPassword;
