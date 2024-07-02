import 'react-native-gesture-handler';
import Navbar from "./components/navbar/navbar";
import { PaperProvider } from "react-native-paper";
import { name as appName } from './app.json';
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from './service/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './service/loginScreen';
import SignUpScreen from "./service/signUpScreen";
import {useEffect} from "react";
import {storeAddresses, removeAddresses, logAsyncStorage} from "./service/utils";

const Stack = createStackNavigator();

export default function App() {
    const addresses = [
        "16 Pankina Grove, Marion 5043, SA",
        "25 Boyle St, Marion SA 5043",
        "1/214 findon rd, findon SA 5023",
        "2 Alice St, Plympton SA 5038",
        "65 West St, Semaphore Park SA 5019"
    ];
    useEffect(() => {
        // removeAddresses();
        storeAddresses(addresses);
    }, []);


    useEffect(() => {
        logAsyncStorage();
    }, []);
    return (
        <AuthProvider>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen name="Main" component={Navbar} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </AuthProvider>
    );
}

AppRegistry.registerComponent(appName, () => App)
