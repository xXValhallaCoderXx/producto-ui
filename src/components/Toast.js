import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ToastContainer = ({ toast }) => {
    console.log("TOAST: ", toast)
  const { title, description = "" } = toast;
  return (
    <View style={[styles.card, styles.shadowProp, styles.elevation]}>
      <View style={{ backgroundColor: "#5048E5", width: 5 }} />
      <View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <MaterialIcons color="#5048E5" size={24} name="check-circle" />

            <View style={{ paddingLeft: 10 }}>
              <Text>{title}</Text>
              {description ? (
                <Text style={{ marginTop: 3 }} variant="bodySmall">
                  {description}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ToastContainer;

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  titleRow: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: Platform.OS === "android" ? 40 : 60,
    width: "85%",
    marginVertical: 10,
    flexDirection: "row",
  },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    shadowColor: "#6B7280",
    elevation: 10,
  },
});
