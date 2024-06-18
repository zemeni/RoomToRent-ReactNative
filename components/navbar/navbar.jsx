import {View, Text, TouchableOpacity} from "react-native";
import {style} from "./navbar.style";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export const Navbar = ({onPress}) => {
    return <View style={style.navbar}>
        <TouchableOpacity onPress={() => onPress("rooms")}>
            <AntDesign name="home" size={34} color="#1DA1F2"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress("jobs")}>
            <MaterialIcons name="event" size={34} color="#1DA1F2"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress("socials")}>
            <FontAwesome name="soccer-ball-o" size={34} color="#1DA1F2"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress("sports")}>
            <MaterialIcons name="sports-cricket" size={34} color="#1DA1F2"/>
        </TouchableOpacity>
    </View>
}