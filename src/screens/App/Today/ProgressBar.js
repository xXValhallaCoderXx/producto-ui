import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import ProgressBar from "../../../components/ProgressBar";

const ProgressBarContainer = ({ focusMode, progress }) => {
  const theme = useTheme();
  console.log("PROPGRESS: ", progress);
  return (
    <View style={{ paddingTop: 0, height: 20 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 15,
        }}
      >
        {focusMode && (
          <>
            <View style={{ flexGrow: 1 }}>
              <ProgressBar progress={isNaN(progress) ? 0 : progress} />
            </View>
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

export default ProgressBarContainer;
