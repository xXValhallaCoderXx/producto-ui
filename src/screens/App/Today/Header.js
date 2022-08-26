import { StyleSheet, View, ToastAndroid } from "react-native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { format, add, sub, isEqual } from "date-fns";
import IonIcon from "react-native-vector-icons/Ionicons";

import { Text, useTheme } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { toggleEdit } from "./today-slice";

const TodayHeader = ({ editMode, onChangeDate, currentDate }) => {
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
        <View>
          <View>
            <Text h4 style={{ color: theme.colors.primary }}>
              {/* {format(currentDate, 'PPP')} */}
              Today
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <IonIcon
              style={{ fontSize: 20, marginRight: 15 }}
              name="caret-back-sharp"
              onPress={onChangeDate("back")}
            />
            <IonIcon

              onPress={onChangeDate("forward")}
              style={{ fontSize: 20}}
              name="caret-forward-sharp"
            />
          </View>
        </View>
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
