import React, { useState, useEffect, useContext,useMemo, useCallback } from 'react';
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
import countriesStates from '../../../assets/countriesStates.json';
import {useFocusEffect} from "@react-navigation/native";

const TopTab = createMaterialTopTabNavigator();

const Room = () => {
    const { user } = useContext(AuthContext);

    if (!user || !user.userProfile) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text>User not logged in.</Text>
            </SafeAreaView>
        );
    }


    const userCountryKey = user.userProfile.country;
    const userStateKey = user.userProfile.state;

    const country = useMemo(() => countriesStates.countries.find(c => c.key === userCountryKey), [userCountryKey]);
    const stateOptions = useMemo(() => country.states.map(s => ({ key: s.key, label: s.label })), [country]);
    const defaultState = useMemo(() => country.states.find(s => s.key === userStateKey), [country, userStateKey]);


    const [state, setState] = useState(defaultState.key);
    const [markers, setMarkers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapLocation, setMapLocation] = useState({
        latitude: defaultState.latitude,
        longitude: defaultState.longitude
    });

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
                type: room.type,
                address: room.address,
                description: room.description
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

    useFocusEffect(
        useCallback(() => {
            fetchRoomData(state);
        }, [state])
    );

    useEffect(() => {
        getUserLocation();
    }, []);

    const handleStateChange = useCallback((itemValue) => {
        const selectedState = country.states.find(s => s.key === itemValue);
        setState(itemValue);
        setMapLocation({
            latitude: selectedState.latitude,
            longitude: selectedState.longitude
        });
    }, [country.states]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pickerContainer}>
                <ModalSelector data={stateOptions}
                               onChange={(option) => handleStateChange(option.key)} >
                    <View style={styles.dropdown}>
                        <Text style={styles.pickerText}>{stateOptions.find(s => s.key === state).label}</Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon}/>
                    </View>
                </ModalSelector>
            </View>

            <TopTab.Navigator
                screenOptions={{unmountOnBlur: false, lazy: true
                }}
            >
                <TopTab.Screen name="Map" >
                    {props => <MapViewTab {...props} markers={markers} mapLocation={mapLocation} userLocation={userLocation}  fetchRoomData={() => fetchRoomData(state)}/>}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} markers={markers} />}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
