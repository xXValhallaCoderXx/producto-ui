import { useState, useCallback, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Modal, StyleSheet, Pressable, Platform } from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
const CalendarWidget = ({
  calendarOpen,
  toggleCalendar,
  incompleteTasks = [],
  currentDate,
  handleOnSelectDay,
  isToday,
}) => {
  const [parsedIncomplete, setParsedIncomplete] = useState({});
  useEffect(() => {
    const parsedData = {};
    if (incompleteTasks.length > 0) {
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
    }
    const today = format(new Date(), "yyyy-MM-dd");
    parsedData[today] = {
      customStyles: {
        container: {
          borderColor: "#5048E5",
          backgroundColor: "#7e79e0",
          borderWidth: 1.5,
          borderRadius: 30,
        },
        text: {
          color: "white",
        },
      },
    };
    setParsedIncomplete(parsedData);
  }, [incompleteTasks, currentDate]);
  // console.log("PARSED: ", parsedIncomplete);
  const onDayPress = useCallback((day) => {
    // setSelected(day.dateString);
    handleOnSelectDay(day);
  }, []);

  return (
    <Modal
      transparent={true}
      visible={calendarOpen}
      onRequestClose={toggleCalendar}
    >
      <Pressable style={styles.modalContainer} onPress={toggleCalendar}>
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
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === "android" ? "25%" : "35%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
  },
  modal: {
    width: 350,
    height: 360,
    borderRadius: 5,
    elevation: 3,
  },
});

export default CalendarWidget;
