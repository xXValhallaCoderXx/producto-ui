import { StyleSheet, View } from "react-native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { format } from "date-fns";
import IonIcon from "react-native-vector-icons/MaterialIcons";
import { Text, useTheme } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { toggleEdit } from "./today-slice";

const TodayHeader = ({ editMode, onChangeDate, clientUtc, onPressToday }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  return (
    <View>
      <Text
        style={{
          marginLeft: -8,
          fontWeight: "700",
          color: theme.colors.primary,
        }}
        h6
      >
        {format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()}
      </Text>

      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <View style={{...styles.dateContainer, height: 50}}>
              <Text
                h4
                style={{ color: theme.colors.primary }}
                onPress={onPressToday}
              >
                Today
              </Text>
              {editMode && (
                <View style={styles.dateContainer}>
                  <IonIcon
                    style={styles.leftArrow}
                    name="keyboard-arrow-left"
                    onPress={onChangeDate("back")}
                  />
                  <IonIcon
                    onPress={onChangeDate("forward")}
                    style={styles.rightArrow}
                    name="keyboard-arrow-right"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <EvilIcon
          onPress={() => dispatch(toggleEdit({ editMode: !editMode }))}
          style={{ fontSize: 40, paddingRight: 8 }}
          color={theme.colors.primary}
          name={editMode ? "unlock" : "lock"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  leftArrow: {
    fontSize: 25,
    marginTop: 5,
    marginLeft: 5,
    padding: 10,
  },
  rightArrow: {
    fontSize: 25,
    marginTop: 5,
    padding: 10,
  },
});

export default TodayHeader;
