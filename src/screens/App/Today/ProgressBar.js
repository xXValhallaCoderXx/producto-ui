import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import ProgressBar from "../../../components/ProgressBar";

const ProgressBarContainer = ({ focusMode, progress }) => {
  const theme = useTheme();

  return (
    <View style={{ paddingTop: 0, height: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 20,
        }}
      >
        {focusMode && (
          <>
            <View style={{ width: "85%" }}>
              <ProgressBar progress={isNaN(progress) ? 0 : progress} />
            </View>
            <View>
              <Text
                h6
                style={{
                  color: theme.colors.primary,
                  fontWeight: "700",
                  marginRight: 7,
                }}
              >
                {Math.round(parseFloat(progress || 0) * 100)} %
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ProgressBarContainer;
