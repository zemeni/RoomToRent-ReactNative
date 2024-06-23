import { View, Text } from "react-native";
import { style } from "./Sports.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Sports = () => {
  const inset = useSafeAreaInsets();
  console.log("sports is rendered");
  return (
    <View
      style={[
        style.sports,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          paddingLeft: inset.left,
          paddingRight: inset.right,
        },
      ]}
    >
      <Text>This is sports</Text>
    </View>
  );
};
export default Sports;
