import { useState, useCallback, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { Modal, Portal } from "react-native-paper";
const CalendarWidget = ({
  calendarOpen,
  toggleCalendar,
  incompleteTasks = [],
  currentDate,
  handleOnSelectDay,
}) => {
  const [parsedIncomplete, setParsedIncomplete] = useState({});
  useEffect(() => {
    if (incompleteTasks.length > 0) {
      const parsedData = {};

      if (!incompleteTasks.includes(format(currentDate, "yyyy-MM-dd"))) {
        parsedData[format(currentDate, "yyyy-MM-dd")] = {
          // marked: true,
          customStyles: {
            container: {
              borderColor: "#5048E5",
              backgroundColor: "#5048E5",
              borderWidth: 0.5,
              borderRadius: 30,
            },
            text: {
              color: "white",
            },
          },
        };
      }

      incompleteTasks.forEach((task) => {
        parsedData[task] = {
          // marked: true,
          customStyles: {
            container: {
              borderColor: "#5048E5",
              backgroundColor:
                format(currentDate, "yyyy-MM-dd") === task
                  ? "#5048E5"
                  : "white",
              borderWidth: 1.5,
              borderRadius: 30,
            },
            text: {
              color:
                format(currentDate, "yyyy-MM-dd") === task ? "white" : "black",
            },
          },
        };
      });
      setParsedIncomplete(parsedData);
    }
  }, [incompleteTasks, currentDate]);

  const onDayPress = useCallback((day) => {
    // setSelected(day.dateString);
    handleOnSelectDay(day);
  }, []);

  return (
    <Portal>
      <Modal
        visible={calendarOpen}
        onDismiss={toggleCalendar}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.modal}>
          <Calendar
            initialDate={format(currentDate, "yyyy-MM-dd")}
            onDayPress={onDayPress}
            markingType={"custom"}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"MMMM yyyy"}
            renderArrow={(direction) => (
              <MaterialIcons
                // style={{ paddingRight: 4, color: theme.colors.primary }}
                name={
                  direction === "left" ? "arrow-back-ios" : "arrow-forward-ios"
                }
              />
            )}
            hideExtraDays={true}
            firstDay={1}
            markedDates={parsedIncomplete}
            disableAllTouchEventsForDisabledDays={true}
            enableSwipeMonths={true}
          />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: 350,
    height: 360,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

export default CalendarWidget;
