import { View } from "react-native";
import {
  ProgressBar as PaperProgressBar,
  MD3Colors,
  Text,
  useTheme,
} from "react-native-paper";

const ProgressBar = ({ focusMode, progress }) => {
  const theme = useTheme();

  if (!focusMode) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 0.8 }}>
        <PaperProgressBar
          style={{ borderRadius: 8, height: 12 }}
          color={MD3Colors.primary0}
          animatedValue={1}
        />
      </View>
      <View style={{ flex: 0.2 }}>
        <Text
          h5
          style={{
            includeFontPadding: false,
            textAlign: "right", 
            color: theme.colors.primary,
            fontWeight: "700",
          }}
        >
          {Math.round(parseFloat(progress || 0) * 100)}%
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;
