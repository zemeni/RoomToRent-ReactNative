import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Room from "../screens/rooms/room";
import Latest from "../screens/latest/Latest";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import sports from "../screens/sports/Sports";
import MyProperty from "../screens/profile/MyProperty";
import Social from "../screens/marketplace/Social";
import {useNavigation} from "@react-navigation/native";
import {AuthContext} from "../auth/AuthContext";
import {useContext, useEffect} from "react";

const Tab = createBottomTabNavigator();

const Navbar = () => {
    const { user } = useContext(AuthContext); // Access user state from AuthContext
    const navigation = useNavigation();

    useEffect(() => {
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        }
    }, [user, navigation]);

    if (!user) {
        return null;
    }

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === "Rooms/Units") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Latest") {
                        iconName = focused ? "information-circle" : "information-circle-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "Sports") {
                        iconName = focused ? "football" : "football-outline";
                    } else if (route.name === "Events") {
                        iconName = focused ? "people" : "people-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="Latest" component={Latest}
                        options={{
                            headerShown: false
                        }}
            />
            <Tab.Screen
                name="Rooms/Units"
                component={Room}
                options={{headerShown: false}}
            />
            <Tab.Screen name="Sports" component={sports}
                        options={{headerShown: false}}
            />
            <Tab.Screen name="Events" component={Social}
                        options={{headerShown: false}}
            />
            <Tab.Screen
                name="Profile"
                component={MyProperty}
                options={{headerTitle: "My Properties"}}
            />
        </Tab.Navigator>
    );
};

export default Navbar;
