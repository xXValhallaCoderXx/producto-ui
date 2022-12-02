import { View } from "react-native";
import { List, Text, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const SettingsListItem = ({ onPress, title, data, hideArrow }) => {
  const theme = useTheme();
  return (
    <List.Item
      style={{
        padding: 0,
        marginLeft: -7,
        backgroundColor: "white",
      }}
      titleStyle={{
        color: "#111827",
        fontWeight: "500",
        fontSize: 18,
      }}
      onPress={onPress}
      title={title}
      right={() => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              marginBottom: 2,
              paddingRight: 5,
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.secondary,
            }}
            type="h3"
          >
            {data}
          </Text>
          {!hideArrow && (
            <MaterialIcons size={24} name="keyboard-arrow-right" />
          )}
        </View>
      )}
    />
  );
};

export default SettingsListItem;
