import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { format } from "date-fns";
import { Text as Text2 } from "react-native-paper";
import IonIcon from "react-native-vector-icons/MaterialIcons";
import { Text, useTheme } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { toggleFocusMode, toggleIsToday } from "./today-slice";

const TodayHeader = ({
  focusMode,
  onChangeDate,
  clientUtc,
  onPressToday,
  onPressDate,
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isToday = useSelector((state) => state.today.isToday);

  useEffect(() => {
    if (clientUtc) {
      const currentDate = format(clientUtc, "yyyy-MM-dd");
      const todayDate = format(new Date(), "yyyy-MM-dd");
      if (currentDate === todayDate) {
        dispatch(toggleIsToday(true));
      } else {
        dispatch(toggleIsToday(false));
      }
    }
  }, [clientUtc]);

  useEffect(() => {
    if (!isToday) {
      dispatch(toggleFocusMode({ focusMode: true }));
    }
  }, [isToday]);

  return (
    <View>
      <TouchableOpacity style={{ height: 18 }} onPress={onPressDate}>
        <Text2
          style={{
            marginLeft: Platform.OS === "ios" ? -26 : -6,
            alignSelf: "flex-start",
            fontWeight: "700",
            color: isToday ? theme.colors.primary : "#6B7280",
          }}
        >
          {focusMode
            ? format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()
            : null}
        </Text2>
      </TouchableOpacity>
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
                      fontWeight: "600",
                    }}
                  >
                    Today
                  </Text>
                </View>
              </TouchableNativeFeedback>
              {focusMode && (
                <View style={styles.dateContainer}>
                  <TouchableOpacity
                    background={TouchableNativeFeedback.Ripple(
                      "#2962ff1f",
                      true
                    )}
                    onPress={onChangeDate("back")}
                  >
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
            onPress={() => dispatch(toggleFocusMode({ focusMode: !focusMode }))}
            style={{ fontSize: 40, paddingRight: 8 }}
            color={theme.colors.primary}
            name={focusMode ? "unlock" : "lock"}
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
