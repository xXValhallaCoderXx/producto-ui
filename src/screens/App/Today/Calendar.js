import { useState, useCallback, useMemo } from "react";
import { Text } from "@rneui/themed";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";

const INITIAL_DATE = "2022-07-06";

const CalendarWidget = ({ calendarOpen, toggleCalendar }) => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

  const getDate = (count) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: "red",
        marked: true,
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "orange",
        selectedTextColor: "red",
      },
    };
  }, [selected]);

  return (
    <Modal
      transparent={true}
      visible={calendarOpen}
      onRequestClose={toggleCalendar}
    >
      <TouchableOpacity style={styles.modalContainer} onPress={toggleCalendar}>
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
        >
          <Calendar
            initialDate={selected}
            onDayPress={onDayPress}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"yyyy MM"}
            hideExtraDays={true}
            firstDay={1}
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
    backgroundColor: 'transparent',
    shadowColor: '#000',
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
