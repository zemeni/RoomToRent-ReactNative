import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Room from "../screens/rooms/room";
import Jobs from "../screens/jobs/jobs";
import MarketPlace from "../screens/marketplace/MarketPlace";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import sports from "../screens/sports/Sports";
import MyProfile from "../screens/profile/MyProfile";

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

                    if (route.name === 'Rooms') {
                        iconName = focused ? 'home-circle' : 'home-circle-outline';
                    } else if (route.name === 'Jobs') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'MarketPlace') {
                        iconName = focused ? 'store' : 'store-outline';
                    } else if (route.name === 'Sports') {
                        iconName = focused ? 'soccer' : 'cricket';
                    }else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Jobs" component={Jobs} />
            <Tab.Screen name="Rooms" component={Room} options={{headerShown: false}}/>
            <Tab.Screen name="MarketPlace" component={MarketPlace} />
            <Tab.Screen name="Sports" component={sports} />
            <Tab.Screen name="Profile" component={MyProfile} options={{headerTitle: "My Profile"}}/>
        </Tab.Navigator>
    );
}

export default Navbar;
