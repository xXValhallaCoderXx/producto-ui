import { useEffect } from "react";
import { Text } from "react-native";
import LayoutView from "../../../components/LayoutView";

const EditScreen = ({ route, navigation }) => {
  const { title } = route.params;
  useEffect(() => {
    navigation.setOptions({ title });
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

export default EditScreen;
