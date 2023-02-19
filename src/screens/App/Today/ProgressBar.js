import { View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import ProgressBar from "../../../components/ProgressBar";

const ProgressBarContainer = ({ focusMode, progress }) => {
  const theme = useTheme();

  const humanReadbleProgess = Math.round(parseFloat(progress || 0) * 100);

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
            <View style={{ flexGrow: 1 }}>
              <ProgressBar progress={isNaN(progress) ? 0 : progress} />
            </View>
            <View
              style={{
                width: 70,
                // paddingLeft: 15,

                alignItems: "flex-end",
              }}
            >
              <Text
                h6
                style={{
                  color: theme.colors.primary,
                  fontWeight: "700",
                  paddingRight: 15,
                }}
              >
                {humanReadbleProgess} %
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ProgressBarContainer;
