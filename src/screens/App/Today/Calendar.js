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
            // Initially visible month. Default = now
            initialDate={selected}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={"2012-05-10"}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={"2012-05-30"}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={onDayPress}
            // Handler which gets executed on day long press. Default = undefined

            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={"yyyy MM"}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            // onMonthChange={(month) => {
            //   console.log("month changed", month);
            // }}
            // // Hide month navigation arrows. Default = false

            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // renderArrow={(direction) => <Arrow />}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            firstDay={1}
            // Hide day names. Default = false

            // Show week numbers to the left. Default = false

            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            // onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            // onPressArrowRight={(addMonth) => addMonth()}

            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            // Enable the option to swipe between months. Default = false
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
