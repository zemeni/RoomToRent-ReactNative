import { Text, View} from "react-native";
import { style } from "./jobs.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkTheme } from "@react-navigation/native";
const Jobs = () => {
  const inset = useSafeAreaInsets();
  console.log("job is rendered");
  return (
    <View
      style={[
        style.jobs,
        {
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
          paddingLeft: inset.left,
          paddingRight: inset.right,
        },
      ]}
    >
      <Text>This is job page</Text>
    </View>
  );
};
export default Jobs;
