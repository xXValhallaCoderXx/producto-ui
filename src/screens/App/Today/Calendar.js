import { useState, useCallback, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Modal, StyleSheet, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarWidget = ({
  calendarOpen,
  toggleCalendar,
  incompleteTasks = [],
  currentDate,
  handleOnSelectDay,
}) => {
  const [selected, setSelected] = useState(
    currentDate.toISOString().split("T")[0]
  );
  const [parsedIncomplete, setParsedIncomplete] = useState({});

  useEffect(() => {
    if (incompleteTasks.length > 0) {
      const parsedData = {};

      const parsedTodayDate = currentDate.toISOString().split("T")[0];
      incompleteTasks.forEach((task) => {
        parsedData[task] = {
          // marked: true,
          customStyles: {
            container: {
              borderColor: "#5048E5",
              backgroundColor: parsedTodayDate === task ? "#5048E5" : "white",
              borderWidth: 0.5,
              borderRadius: 30,
            },
            text: {
              color: parsedTodayDate === task ? "white" : "black",
            },
          },
        };
      });
      setParsedIncomplete(parsedData);
    }
  }, [incompleteTasks, currentDate]);

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
    handleOnSelectDay(day);
  }, []);

  return (
    <Modal
      // animationType="fade"
      transparent={true}
      visible={calendarOpen}
      onRequestClose={toggleCalendar}
    >
      <Pressable style={styles.modalContainer} onPress={toggleCalendar}>
        <View style={styles.modal}>
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
        </View>
      </Pressable>
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
    elevation: 3,
  },
});

export default CalendarWidget;
