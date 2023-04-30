import React, { useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import productoLogo from "../../../assets/images/title-dark.png";
import { toggleFirstLoad } from "../../../shared/slice/global-slice";
import lockClosed from "../../../assets/images/lock-closed.png";
import IoniIcons from "react-native-vector-icons/Ionicons";

const IntroBottomSheet = ({ user, isLoading }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { firstLoad } = useSelector((state) => state.global);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "35%"], []);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop opacity={0.5} {...props} />,
    []
  );

  // callbacks
  const handleSheetChanges = useCallback(
    async (index) => {
      if (index === -1) {
        await AsyncStorage.setItem(`@first-load-${user}`, "false");
        dispatch(toggleFirstLoad(false));
      }
    },
    [user, isLoading]
  );

  if (!firstLoad || isLoading) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      enablePanDownToClose
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.contentContainer}>
        {/* <Text
          style={{
            color: "#6B7280",
            fontSize: 20,
            // marginBottom: 5,
            paddingRight: 5,
            fontWeight: "600",
          }}
        >
          Welcome to
        </Text> */}
        <Image source={productoLogo} style={{ width: 140, height: 25 }} />
      </View>
      <View style={{ padding: 30 }}>
        <Text
          style={{
            color: "#5048E5",
            fontSize: 14,
            fontWeight: "600",

            marginBottom: 5,
          }}
        >
          Getting started
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Image source={lockClosed} style={{ height: 22 }} />
          <Text style={{ color: "#6B7280", fontSize: 12, marginLeft: 15 }}>
            Turn on "Focus mode", do away with distractions and only see the
            tasks, which you have set out to focus on.
          </Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}
        >
          <IoniIcons
            style={styles.keyIcon}
            color={theme.colors.secondary}
            name={"key-outline"}
          />
          <Text style={{ color: "#6B7280", fontSize: 12, marginLeft: 10 }}>
            Choose which tasks you want to focus on, by toggling the key, in
            focus mode you will only see the tasks you select.
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 10,
    borderColor: "gray",
    alignItems: "center",
  },
  keyIcon: {
    fontSize: 22,
    transform: [{ rotate: "45deg" }],
    alignSelf: "center",
  },
});

export default IntroBottomSheet;
