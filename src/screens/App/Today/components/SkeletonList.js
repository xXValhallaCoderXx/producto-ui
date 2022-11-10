import { View } from "react-native";
import SkeletonBox from "../../../../components/SkeletonBox";

const SkeletonList = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonBox width={40} />
        </View>
        <View style={{ flex: 4 }}>
          <SkeletonBox width={"100%"} />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <SkeletonBox width={30} />
        </View>
      </View>
  
    </View>
  );
};

export default SkeletonList;
