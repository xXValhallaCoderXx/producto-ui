import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { format } from "date-fns";

import IonIcon from "react-native-vector-icons/MaterialIcons";
import { Text, useTheme } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { toggleEdit } from "./today-slice";

const TodayHeader = ({
  editMode,
  onChangeDate,
  clientUtc,
  onPressToday,
  onPressDate,
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (clientUtc) {
      const currentDate = format(clientUtc, "yyyy-MM-dd");
      const todayDate = format(new Date(), "yyyy-MM-dd");
      if (currentDate === todayDate) {
        setIsToday(true);
      } else {
        setIsToday(false);
      }
    }
  }, [clientUtc]);

  useEffect(() => {
    if (!isToday) {
      dispatch(toggleEdit({ editMode: true }));
    }
  }, [isToday]);

  return (
    <View>
      <View style={{ height: 18 }}>
        {!editMode ? null : (
          <TouchableOpacity onPress={onPressDate}>
            <Text
              style={{
                marginLeft: -8,
                fontWeight: "700",
                color: "#6B7280",
              }}
              h6
            >
              {format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <View style={{ ...styles.dateContainer, height: 50 }}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
                onPress={onPressToday}
              >
               <View>
               <Text
                  h4
                  style={{
                    color: theme.colors.primary,
                  }}
                >
                  Today
                </Text>
               </View>
              </TouchableNativeFeedback>
              {editMode && (
                <View style={styles.dateContainer}>
                  <TouchableOpacity   background={TouchableNativeFeedback.Ripple("#2962ff1f", true)} onPress={onChangeDate("back")}>
                    <IonIcon
                      style={styles.leftArrow}
                      name="keyboard-arrow-left"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onChangeDate("forward")}>
                    <IonIcon
                      style={styles.rightArrow}
                      name="keyboard-arrow-right"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        {isToday ? (
          <EvilIcon
            onPress={() => dispatch(toggleEdit({ editMode: !editMode }))}
            style={{ fontSize: 40, paddingRight: 8 }}
            color={theme.colors.primary}
            name={editMode ? "unlock" : "lock"}
          />
        ) : null}
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
