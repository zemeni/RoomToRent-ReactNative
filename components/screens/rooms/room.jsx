import { View, Text } from "react-native";
import { style } from "./room.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Room = () => {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        style.room,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          paddingLeft: inset.left,
          paddingRight: inset.right,
        },
      ]}
    >
      <Text>This is Room page</Text>
    </View>
  );
};
export default Room;
