import { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Animated,
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
  const posXanim = useRef(new Animated.Value(0)).current;

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
    Animated.timing(posXanim, {
      toValue: focusMode ? 0 : -15,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [focusMode]);

  useEffect(() => {
    if (!isToday) {
      dispatch(toggleFocusMode({ focusMode: true }));
    }
  }, [isToday]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <TouchableOpacity onPress={onPressDate} style={{ height: 18 }}>
          <Text2
            style={{
              marginLeft: Platform.OS === "ios" ? -28 : -6,
              alignSelf: "flex-start",
              fontWeight: "700",
              letterSpacing: 0.8,
              color: isToday ? theme.colors.primary : "#6B7280",
            }}
          >
            {focusMode
              ? format(new Date(clientUtc), "	EEE, d LLL yyyy").toUpperCase()
              : null}
          </Text2>
        </TouchableOpacity>
        <View style={{ ...styles.row, marginTop: 5 }}>
          <View>
            <View style={{ ...styles.dateContainer }}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple("#2962ff1f", true)}
                onPress={onPressToday}
              >
                <Animated.View
                  style={{ transform: [{ translateY: posXanim }] }}
                >
                  <Text
                    h3
                    style={{
                      color: theme.colors.primary,
                      letterSpacing: 0.5,

                      fontWeight: "700",
                    }}
                  >
                    Today
                  </Text>
                </Animated.View>
              </TouchableNativeFeedback>
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
        </View>
      </View>
      <View style={{ justifyContent: "center" }}>
        {isToday ? (
          <EvilIcon
            onPress={() => dispatch(toggleFocusMode({ focusMode: !focusMode }))}
            style={{ fontSize: 40, paddingRight: 8 }}
            color={theme.colors.primary}
            name={focusMode ? "unlock" : "lock"}
          />
        ) : null}
      </View>
      {/* 
     

      <View style={styles.container}>
      
       
      </View> */}
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
