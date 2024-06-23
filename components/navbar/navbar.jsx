import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Room from "../screens/rooms/room";
import Jobs from "../screens/jobs/jobs";
import Sports from "../screens/sports/Sports";
import MarketPlace from "../screens/marketplace/MarketPlace";



const Navbar = () =>  {
    const Tab = createBottomTabNavigator();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            let { name } = route;
                            if (name === "Rooms") {
                                iconName = focused ? "home" : "home-outline";
                            } else if (name === "Jobs") {
                                iconName = focused ? "briefcase" : "briefcase-outline";
                            } else if (name === "Sports") {
                                iconName = focused ? "trophy" : "trophy-outline";
                            } else if (name === "Marketplace") {
                                iconName = focused ? "storefront" : "storefront-outline";
                            }
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: "#1877F2",
                        tabBarInactiveTintColor: "gray",
                    })}
                >
                    <Tab.Screen name="Rooms" component={Room} />
                    <Tab.Screen name="Jobs" component={Jobs} />
                    <Tab.Screen name="Sports" component={Sports} />
                    <Tab.Screen name="Marketplace" component={MarketPlace} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default Navbar;
