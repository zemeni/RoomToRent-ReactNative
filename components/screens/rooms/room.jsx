// http://192.168.1.108:4000/api/rooms

import React, { useState, useEffect, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewTab from './mapView/mapView';
import ListView from './listView/listView';
import { styles } from './room.style';
import getCoordinatesFromAddress from '../../../service/geoCordinateConverter';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';

const TopTab = createMaterialTopTabNavigator();

const Room = () => {
    const [state, setState] = useState('NSW');
    const [markers, setMarkers] = useState([]);
    const [location, setLocation] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission to access location was denied. Please enable it in settings to continue.',
                    [{ text: 'OK' }]
                );
                return;
            }

            let { coords } = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        };

        const fetchRoomData = async () => {
            try {
                const response = await axios.get('http://192.168.1.108:4000/api/rooms'); // Replace with your IP address
                console.log("rooms response is ", response.data);

                const fetchedMarkers = response.data.map((room, index) => ({
                    id: room.id.toString(),
                    coordinate: {
                        latitude: room.latitude,
                        longitude: room.longitude
                    },
                    title: `Price: ${room.price}`,
                    // description: room.description
                }));

                setMarkers(fetchedMarkers);
            } catch (error) {
                console.error("Error fetching rooms data: ", error.message);
            }
        };

        getLocation();
        fetchRoomData();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={state}
                    style={styles.picker}
                    onValueChange={(itemValue) => setState(itemValue)}
                >
                    <Picker.Item label="New South Wales" value="NSW" />
                    <Picker.Item label="Victoria" value="VIC" />
                    <Picker.Item label="Queensland" value="QLD" />
                    <Picker.Item label="South Australia" value="SA" />
                    <Picker.Item label="Western Australia" value="WA" />
                </Picker>
            </View>

            <TopTab.Navigator>
                <TopTab.Screen name="Map">
                    {props => <MapViewTab {...props} markers={markers} userLocation={location} />}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} />}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
