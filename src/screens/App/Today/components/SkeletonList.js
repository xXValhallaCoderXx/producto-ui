import { View } from "react-native";
import SkeletonBox from "../../../../components/SkeletonBox";

const SkeletonRow = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 20,
        marginBottom: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <SkeletonBox width={"80%"} />
      </View>
      <View style={{ flex: 4 }}>
        <SkeletonBox width={"100%"} />
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <SkeletonBox width={"90%"} />
      </View>
    </View>
  );
};

const SkeletonList = () => {
  return (
    <View>
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </View>
  );
};

export default SkeletonList;
