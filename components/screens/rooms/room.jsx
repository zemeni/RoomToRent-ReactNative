import React, { useState, useEffect, useContext, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, SafeAreaView, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import MapViewTab from './mapView/mapView';
import ListView from './listView/listView';
import { styles } from './room.style';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/Ionicons';

const TopTab = createMaterialTopTabNavigator();

const stateCoordinates = {
    NSW: { latitude: -33.8688, longitude: 151.2093 },
    VIC: { latitude: -37.8136, longitude: 144.9631 },
    QLD: { latitude: -27.4698, longitude: 153.0251 },
    SA: { latitude: -34.9285, longitude: 138.6007 },
    WA: { latitude: -31.9505, longitude: 115.8605 },
    TAS: { latitude: -42.8821, longitude: 147.3272 },
    NT: { latitude: -12.4634, longitude: 130.8456 },
    ACT: { latitude: -35.2809, longitude: 149.1300 }
};

const Room = () => {
    const { user } = useContext(AuthContext);
    const [state, setState] = useState(user?.userProfile?.state || 'NSW');
    const [markers, setMarkers] = useState([]);
    const [mapLocation, setMapLocation] = useState(stateCoordinates[state]);
    const [userLocation, setUserLocation] = useState(null);

    const stateOptions = [
        { key: 'NSW', label: 'New South Wales' },
        { key: 'VIC', label: 'Victoria' },
        { key: 'QLD', label: 'Queensland' },
        { key: 'SA', label: 'South Australia' },
        { key: 'WA', label: 'Western Australia' },
        { key: 'TAS', label: 'Tasmania' },
        { key: 'NT', label: 'Northern Territory' },
        { key: 'ACT', label: 'Australian Capital Territory' }
    ];

    const fetchRoomData = useCallback(async (selectedState) => {
        try {
            const response = await axios.get(`http://192.168.1.108:4000/api/properties?state=${selectedState}`);
            const fetchedMarkers = response.data.map((room) => ({
                id: room.id.toString(),
                coordinate: {
                    latitude: room.latitude,
                    longitude: room.longitude
                },
                price: room.price,
                type: room.type
            }));
            setMarkers(fetchedMarkers);
        } catch (error) {
            console.error("Error fetching rooms data: ", error.message);
        }
    }, []);

    const getUserLocation = useCallback(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission to access location was denied. Please enable it in settings to continue.',
                [{ text: 'OK' }]
            );
            return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
    }, []);

    useEffect(() => {
        fetchRoomData(state);
        getUserLocation();
    }, [state, fetchRoomData, getUserLocation]);

    const handleStateChange = useCallback((itemValue) => {
        setState(itemValue);
        setMapLocation(stateCoordinates[itemValue]);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pickerContainer}>
                <ModalSelector
                    data={stateOptions}
                    onChange={(option) => handleStateChange(option.key)}
                >
                    <View style={styles.dropdown}>
                        <Text style={styles.pickerText}>
                            {stateOptions.find(s => s.key === state)?.label || 'Select State'}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                    </View>
                </ModalSelector>
            </View>

            <TopTab.Navigator>
                <TopTab.Screen name="Map">
                    {props => <MapViewTab {...props} markers={markers} mapLocation={mapLocation} userLocation={userLocation} fetchRoomData={() => fetchRoomData(state)} />}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} markers={markers} fetchRoomData={() => fetchRoomData(state)} />}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
