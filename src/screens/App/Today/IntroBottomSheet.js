import React, { useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import productoLogo from "../../../assets/images/title-dark.png";
import cat from "../../../assets/images/cat.png";
const IntroBottomSheet = () => {
  const { firstLoad } = useSelector((state) => state.global);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop opacity={0.5} {...props} />,
    []
  );

  // callbacks
  const handleSheetChanges = useCallback(async (index) => {
    console.log("handleSheetChanges", index);
    if (index === -1) {
      await AsyncStorage.setItem("@first-load", "true");
    }
  }, []);

  if (!firstLoad) {
    return null;
  }

  // renders
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
        {/* <Text
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
        </Text> */}
               <Text
          style={{
            color: "#5048E5",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 5,
          }}
        >
          Always stay Positive - You Badut
        </Text>
        <Text style={{ color: "#6B7280", fontSize: 12 }}>
          Remember who you are Chermaaaaaaine, you're a rare gem - keep that hunger and motivation ^_^
        </Text>
        <Text style={{marginTop: 5,  color: "#6B7280", fontSize: 12 }}>So please don't loose your "DAO", 
          and thank you for giving me motivation to work on this app ^_^</Text>
          <Image source={cat} style={{ width: 50, height: 80, alignSelf: "center" }} />
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
