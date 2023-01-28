import React, { useCallback, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import productoLogo from "../../../assets/images/title-dark.png";
import { toggleFirstLoad } from "../../../shared/slice/global-slice";

const IntroBottomSheet = ({ user, isLoading }) => {
  const dispatch = useDispatch();
  const { firstLoad } = useSelector((state) => state.global);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

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
        <Text
          style={{
            color: "#6B7280",
            fontSize: 25,
            marginBottom: 5,
            fontWeight: "600",
          }}
        >
          Welcome To
        </Text>
        <Image source={productoLogo} style={{ width: 220, height: 40 }} />
      </View>
      <View style={{ padding: 30 }}>
        <Text
          style={{
            color: "#5048E5",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 5,
          }}
        >
          Discover Your Productivity
        </Text>
        <Text style={{ color: "#6B7280", fontSize: 12 }}>
          Regain clarity with your life, by getting all those little things
          done, with Producto you have all the tools you need.
        </Text>

        <Text style={{ color: "#6B7280", fontSize: 12, marginTop: 15 }}>
          Get started by adding tasks, and choose which ones you want to focus
          on first, by toggling their "key", these are the only tasks you will
          see, when locked into focus mode
        </Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderColor: "gray",
    alignItems: "center",
  },
});

export default IntroBottomSheet;
