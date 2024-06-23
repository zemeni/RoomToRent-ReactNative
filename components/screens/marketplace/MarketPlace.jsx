import { View, Text } from "react-native";
import { style } from "./MarketPlace.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const MarketPlace = () => {
  const inset = useSafeAreaInsets();

  console.log("market place is rendered");
  return (
    <View
      style={[
        style.marketplace,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          paddingLeft: inset.left,
          paddingRight: inset.right,
        },
      ]}
    >
      <Text>This is marketplace</Text>
    </View>
  );
};
export default MarketPlace;
