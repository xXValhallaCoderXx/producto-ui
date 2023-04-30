import DraggableFlatList from "react-native-draggable-flatlist";
import listToKeyboardEvents from "react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC";

const config = {
  enableOnAndroid: true,
  enableAutomaticScroll: true,
  enableResetScrollToCoords: false,
};

export default listToKeyboardEvents(config)(DraggableFlatList);
