import { useEffect } from "react";
import { add, sub, startOfDay, endOfDay } from "date-fns";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image,
} from "react-native";
import { format } from "date-fns";
import { Text, useTheme } from "react-native-paper";
import IonIcon from "react-native-vector-icons/MaterialIcons";

import { useDispatch, useSelector } from "react-redux";
import {
  toggleFocusMode,
  selectIsToday,
  selectCurrentDate,
  setEditingTask,
  setCurrentDate,
} from "../today-slice";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProgressBar from "../../../../components/ProgressBar";

const TodayHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isToday = useSelector(selectIsToday);
  const clientUtc = useSelector(selectCurrentDate);
  const focusMode = useSelector((state) => state.today.focusMode);

  const onPressDate = () => {
    console.log("DATE");
  };

  const onPressToday = () => {
    console.log("DATE");
  };

  const onChangeDate = (direction) => () => {
    console.log("eheh");
    dispatch(setEditingTask(null));
    if (direction === "back") {
      const subUtcDate = sub(clientUtc, { days: 1 });
      dispatch(setCurrentDate(subUtcDate.toISOString()));
    } else {
      const addUtcDate = add(new Date(clientUtc), { days: 1 });
      dispatch(setCurrentDate(addUtcDate.toISOString()));
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: "white" }}>
      <TouchableOpacity style={{ height: 18 }} onPress={onPressDate}>
        <Text
          style={{
            marginLeft: Platform.OS === "ios" ? -28 : -6,
            alignSelf: "flex-start",
            fontWeight: "700",
            color: isToday ? theme.colors.primary : "#6B7280",
          }}
        >
          {format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()}
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <View style={{ ...styles.dateContainer, height: 50 }}>
              <TouchableOpacity onPress={onPressToday}>
                <View>
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "700",
                    }}
                  >
                    Today
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
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
            </View>
          </View>
        </View>
        {
          <TouchableOpacity
            onPress={() => dispatch(toggleFocusMode({ focusMode: !focusMode }))}
            style={{ padding: 5 }}
          >
            <Ionicons
              name={focusMode ? "eye-off-outline" : "eye-outline"}
              size={32}
              color="#1c1b1f"
            />
          </TouchableOpacity>
        }
      </View>
      <ProgressBar progress={0.5} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  dateContainer: {
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
