import { View } from "react-native";
import { Text, useTheme, LinearProgress } from "@rneui/themed";

const ProgressBar = ({ focusMode, progress }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
 
        justifyContent: "space-between",
      }}
    >
      {focusMode && (
        <>
          <LinearProgress
            style={{
         
              height: 15,
              borderRadius: 8,
              flex: 0.8,
            }}
            trackColor="#F2F2F2"
            animation={{ duration: 200 }}
            value={progress}
            color={theme.colors.primary}
            variant="determinate"
          />
          <Text
            h5
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
  );
};

export default ProgressBar;
