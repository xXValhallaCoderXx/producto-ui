import { useState, useCallback, useMemo, useEffect } from "react";
import { Text } from "@rneui/themed";
import { format } from "date-fns";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";

const CalendarWidget = ({
  calendarOpen,
  toggleCalendar,
  incompleteTasks = [],
  currentDate,
  handleOnSelectDay,
}) => {
  const [selected, setSelected] = useState(format(currentDate, "yyyy-MM-dd"));
  const [currentMonth, setCurrentMonth] = useState(
    format(currentDate, "yyyy-MM-dd")
  );
  const [parsedIncomplete, setParsedIncomplete] = useState({});

  useEffect(() => {
    if (incompleteTasks.length > 0) {
      const parsedData = {};
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
              borderWidth: 0.5,
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
  }, [incompleteTasks]);

  const getDate = (count) => {
    const date = new Date(currentDate);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day) => {
    console.log("HMHMHM");
    setSelected(day.dateString);
    handleOnSelectDay(day);
  }, []);

  return (
    <Modal
      transparent={true}
      visible={calendarOpen}
      onRequestClose={toggleCalendar}
    >
      <TouchableOpacity style={styles.modalContainer} onPress={toggleCalendar}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <Calendar
            initialDate={selected}
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 350,
    height: 310,
    borderRadius: 5,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default CalendarWidget;
