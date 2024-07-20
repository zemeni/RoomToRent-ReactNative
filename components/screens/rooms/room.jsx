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

        getLocation();
        fetchMarkers();
    }, []);

    const fetchMarkers = async () => {
        try {
            const storedAddresses = await AsyncStorage.getItem('ADDRESSES_KEY');
            if (storedAddresses !== null) {
                const parsedAddresses = JSON.parse(storedAddresses);
                const markerPromises = parsedAddresses.map(async (address, index) => {
                    const coords = await getCoordinatesFromAddress(address);
                    return coords ? {
                        id: index.toString(),
                        coordinate: coords,
                        title: `Marker ${index + 1}`,
                        description: address,
                    } : null;
                });

                const fetchedMarkers = await Promise.all(markerPromises);
                setMarkers(fetchedMarkers.filter(marker => marker !== null));
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

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
