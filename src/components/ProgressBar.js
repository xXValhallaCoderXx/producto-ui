import Progress from "react-native-progress/Bar";
import { useTheme } from "react-native-paper";

const ProgressBar = ({ progress }) => {
  const theme = useTheme();

  return (
    <Progress
      borderColor="white"
      height={15}
      progress={progress}
      width={null}
      color={theme.colors.primary}
    />
  );
};

export default ProgressBar;
