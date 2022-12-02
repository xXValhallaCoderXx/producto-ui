import { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";

import { format } from "date-fns";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFocusMode,
  toggleIsToday,
} from "../../../shared/slice/today-slice";

const TodayHeader = ({
  onPressToday,
  onChangeDate,
  clientUtc,
  onPressDate,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isToday = useSelector((state) => state.today.isToday);
  const focusMode = useSelector((state) => state.today).focusMode;

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

  // useEffect(() => {
  //   Animated.timing(posXanim, {
  //     toValue: focusMode ? 0 : -15,
  //     duration: 350,
  //     useNativeDriver: true,
  //   }).start();
  // }, [focusMode]);

  useEffect(() => {
    if (!isToday) {
      dispatch(toggleFocusMode({ focusMode: true }));
    }
  }, [isToday]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <TouchableOpacity onPress={onPressDate} style={{ height: 18 }}>
          <Text
            style={{
              marginLeft: Platform.OS === "ios" ? -28 : -6,
              fontWeight: "700",
              letterSpacing: 0.6,
              color: isToday ? theme.colors.primary : "#6B7280",
            }}
          >
            {focusMode
              ? format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()
              : null}
          </Text>
        </TouchableOpacity>
        <View style={{ ...styles.row, marginTop: 5 }}>
          <View>
            <View style={{ ...styles.dateContainer }}>
              <TouchableOpacity onPress={onPressToday}>
                <View>
                  <Text
                    variant="headlineLarge"
                    style={{
                      color: theme.colors.primary,
                      letterSpacing: 0.5,
                      fontWeight: "700",
                    }}
                  >
                    Today
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{ height: 55 }}>
                {focusMode && (
                  <View style={styles.dateContainer}>
                    <TouchableOpacity
                      background={TouchableNativeFeedback.Ripple(
                        "#2962ff1f",
                        true
                      )}
                      onPress={onChangeDate("back")}
                    >
                      <MaterialIcons
                        style={styles.leftArrow}
                        name="keyboard-arrow-left"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onChangeDate("forward")}>
                      <MaterialIcons
                        style={styles.rightArrow}
                        name="keyboard-arrow-right"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      {isToday ? (
        <EvilIcons
          onPress={() => dispatch(toggleFocusMode({ focusMode: !focusMode }))}
          style={{ fontSize: 40, marginRight: -10 }}
          color={theme.colors.primary}
          name={focusMode ? "unlock" : "lock"}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 30,
    marginTop: 5,
    marginLeft: 5,
    padding: 10,
  },
  rightArrow: {
    fontSize: 30,
    marginTop: 5,
    padding: 10,
  },
});

export default TodayHeader;
