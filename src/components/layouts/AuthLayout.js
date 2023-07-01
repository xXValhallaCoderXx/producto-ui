import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
const titleDark = require("../../assets/images/title-dark.png");

const AuthLayout = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};

const Header = ({ subTitle, customTitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={titleDark} resizeMode="contain" style={styles.image} />
      {customTitle ? (
        customTitle
      ) : (
        <Text style={styles.subTitle}>{subTitle}</Text>
      )}
    </View>
  );
};

const Content = ({ children }) => {
  return <View style={styles.contentContainer}>{children}</View>;
};

const FooterActions = ({ children }) => {
  return <View style={styles.footerContainer}>{children}</View>;
};

AuthLayout.Header = Header;
AuthLayout.Content = Content;
AuthLayout.Footer = FooterActions;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  subTitle: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
    marginTop: 19,
    marginLeft: -5,
  },
  image: {
    width: 231,
    height: 42,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 45,
  },
  footerContainer: {
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
});

export default AuthLayout;
