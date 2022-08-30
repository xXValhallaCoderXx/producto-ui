import { View } from "react-native";
import { Text, useTheme, LinearProgress } from "@rneui/themed";

const ProgressBar = ({ editMode, progress }) => {
  const { theme } = useTheme();

  return (
    <View style={{ paddingTop: 0 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 15,
        }}
      >
        {editMode && (
          <>
            <LinearProgress
              style={{
                marginVertical: 15,
                height: 15,
                borderRadius: 8,
                flex: 0.85,
              }}
              animation={{duration: 200}}
              value={progress}
              color={theme.colors.primary}
              variant="determinate"
            />
            <Text
              h6
              style={{
                flex: 0.15,
                textAlign: "center",
                color: theme.colors.primary,
                fontWeight: "700",
              }}
            >
              {Math.round(parseFloat(progress || 0) * 100)}%
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default ProgressBar;
