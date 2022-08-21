import { StyleSheet, View, ToastAndroid } from "react-native";
import EvilIcon from "react-native-vector-icons/EvilIcons";

import { Text, useTheme } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { toggleEdit } from "./today-slice";

const TodayHeader = ({ editMode }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text h4 style={{ color: theme.colors.primary }}>
          Today
        </Text>
        <Text h4>'s tasks</Text>
      </View>

      <EvilIcon
        onPress={() => dispatch(toggleEdit({ editMode: !editMode }))}
        style={{ fontSize: 40 }}
        color={theme.colors.primary}
        name={editMode ? "unlock" : "lock"}
      />
    </View>
  );
};

export default TodayHeader;
