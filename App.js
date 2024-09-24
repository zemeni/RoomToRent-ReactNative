import 'react-native-gesture-handler';
import Navbar from "./components/navbar/navbar";
import { PaperProvider } from "react-native-paper";
import { name as appName } from './app.json';
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/auth/loginScreen';
import SignUpScreen from "./components/auth/signUpScreen";
import { useContext, useEffect } from "react";
import DetailsPage from "./components/screens/rooms/listView/detailsPage";
import Toast from 'react-native-toast-message';
import MarkerDetailsPage from "./components/screens/rooms/mapView/markerDetailsPage";
import EditRoomPropertyDetails from "./components/screens/profile/EditRoomPropertyDetails";
import MyProperty from "./components/screens/profile/MyProperty";
import EditUnitPropertyDetails from "./components/screens/profile/EditUnitPropertyDetails";

const Stack = createStackNavigator();

function AppNavigator() {
    const { user } = useContext(AuthContext);

    console.log("I am still inside App page");

    return (
        <Stack.Navigator>
            {user ? (
                <>
                    <Stack.Screen name="Main" component={Navbar} options={{ headerShown: false }} />
                    <Stack.Screen name="DetailsPage" component={DetailsPage} />
                    <Stack.Screen name="MyProperty" component={MyProperty} />
                    <Stack.Screen name="MarkerDetailsPage" component={MarkerDetailsPage} options={{title:'Property Details'}}/>
                    <Stack.Screen name="EditRoomPropertyDetails" component={EditRoomPropertyDetails} options={{title:'Edit Room Details', presentation: 'modal'}}/>
                    <Stack.Screen name="EditUnitPropertyDetails" component={EditUnitPropertyDetails} options={{title:'Edit Unit Details', presentation: 'modal'}}/>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <PaperProvider>
                <NavigationContainer>
                    <AppNavigator />
                    <Toast refs={refs => Toast.setRef(refs)} />
                </NavigationContainer>
            </PaperProvider>
        </AuthProvider>
    );
}

AppRegistry.registerComponent(appName, () => App);
