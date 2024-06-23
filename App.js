import Navbar from "./components/navbar/navbar";
import {PaperProvider} from "react-native-paper";
import { name as appName } from './app.json';
import {AppRegistry} from "react-native";
import {NavigationContainer} from "@react-navigation/native";

export default function App() {
    return (
        <PaperProvider>
            <NavigationContainer><Navbar/></NavigationContainer>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => App)
