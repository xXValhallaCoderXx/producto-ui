import { useTheme, ProgressBar as Progress } from "react-native-paper";

const ProgressBar = ({ progress, visible = true }) => {
  const theme = useTheme();

  return (
    <Progress
      progress={progress}
      style={{ borderRadius: 20, height: 15 }}
      color={theme.colors.primary}
    />
  );
};

export default ProgressBar;
