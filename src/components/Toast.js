import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
const ToastContainer = ({ toast }) => {
  const { title, description } = toast;
  return (
    <View style={[styles.card, styles.shadowProp, styles.elevation]}>
      <View style={{ backgroundColor: "red", width: 5 }} />
      <View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={{ marginRight: 10 }}>Success</Text>
            <View>
              <Text>{title}</Text>
              <Text style={{ marginTop: 3 }} variant="bodySmall">
                {description}
              </Text>
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
