import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {View, Text} from "react-native";
import {style} from "./App.style";
import {Logo} from "./components/logo/logo";
import {Navbar} from "./components/navbar/navbar";
import {Room} from "./components/room/room";

export default function App() {
    const navigateToTab = (tabName) => {
        console.log(`navigate to ${tabName}`);
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={style.app}>
                <Logo />
                <Navbar onPress = {navigateToTab} />
                <Room />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


