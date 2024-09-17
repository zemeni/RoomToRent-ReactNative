import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Room from "../screens/rooms/room";
import Jobs from "../screens/jobs/jobs";
import MarketPlace from "../screens/marketplace/MarketPlace";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import sports from "../screens/sports/Sports";
import MyProperty from "../screens/profile/MyProperty";

const Tab = createBottomTabNavigator();

const Navbar = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Rooms") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Jobs") {
                        iconName = focused ? "briefcase" : "briefcase-outline";
                    } else if (route.name === "MarketPlace") {
                        iconName = focused ? "storefront" : "storefront-outline";
                    } else if (route.name === "Sports") {
                        iconName = focused ? "trophy" : "trophy-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Sports" component={Jobs} />
      <Tab.Screen
        name="Rooms"
        component={Room}
        options={{ headerShown: false }}
      />
      {/*<Tab.Screen name="MarketPlace" component={MarketPlace} />*/}
      {/*<Tab.Screen name="Sports" component={sports} />*/}
      <Tab.Screen
        name="Profile"
        component={MyProperty}
        options={{ headerTitle: "My Properties" }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
