import { Text } from "@rneui/base";
import { useTheme } from "@rneui/themed";

const TextComponent = ({
  type = "h3",
  children,
  customStyle,
  color = "primary",
}) => {
  const { theme } = useTheme();

  const mapColor = () => {
    switch (color) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "black":
        return theme.colors.black;
      default:
        return theme.colors.primary;
    }
  };

  const renderStyle = () => {
    switch (type) {
      case "h2":
        return {
          fontSize: 20,
          fontWeight: "700",
          color: mapColor(),
        };
      case "h3":
        return {
          fontSize: 16,
          fontWeight: "600",
          color: mapColor(),
        };
      case "h4":
        return {
          fontSize: 12,
          fontWeight: "600",
          color: mapColor(),
        };
      default:
        return {
          fontSize: 16,
          fontWeight: "600",
          color: mapColor(),
        };
    }
  };
  return <Text style={{ ...customStyle, ...renderStyle() }}>{children}</Text>;
};

export default TextComponent;
