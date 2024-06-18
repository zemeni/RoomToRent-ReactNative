import {View, Text} from "react-native";
import {style} from "./logo.style";

export const Logo = () => {
    return <View style={style.logo}>
        <Text style={style.logoText}>RoomToRent</Text>
    </View>
}