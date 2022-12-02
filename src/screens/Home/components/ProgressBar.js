import { View } from "react-native";
import { Text, useTheme, ProgressBar } from "react-native-paper";

const ProgressRow = ({ progress }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 0.9 }}>
        <ProgressBar
          style={{ height: 13, borderRadius: 8 }}
          progress={progress}
          color={theme.colors.primary}
        />
      </View>
      <View>
        <Text
          style={{
            color: theme.colors.primary,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
};

export default ProgressRow;
