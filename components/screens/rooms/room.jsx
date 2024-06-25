import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, SafeAreaView, TouchableWithoutFeedback, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles } from './room.style';
import MapViewTab from './mapView/mapView';
import ListView from './listView/listView';
import SearchModal from "./modal/modal";
import * as Location from 'expo-location';

const markerData = require('./data/data.json');

const TopTab = createMaterialTopTabNavigator();

const Room = () => {
    const [visible, setVisible] = useState(false);
    const [suburb, setSuburb] = useState('');
    const [postcode, setPostcode] = useState('');
    const [state, setState] = useState('');
    const [markers, setMarkers] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [location, setLocation] = useState(null);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

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
    }, []);

    useEffect(() => {
        if (filtersApplied && location) {
            console.log("API call is made with location:", location);
            // Call your API with the location to filter data
            // For now, we'll just load the local JSON data
            setMarkers(markerData);
        }
    }, [filtersApplied, location]);

    const handleApplyFilters = () => {
        console.log("filter is applied");
        hideModal();
        setFiltersApplied(true); // Set filtersApplied to true after applying filters
    };

    console.log("room is rendered, location is ", location);

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={showModal}>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search in Suburb, PostCode & State"
                        editable={false}
                        style={styles.filterTextInput}
                    />
                </View>
            </TouchableWithoutFeedback>

            <SearchModal
                visible={visible}
                hideModal={hideModal}
                suburb={suburb}
                postcode={postcode}
                state={state}
                setSuburb={setSuburb}
                setPostcode={setPostcode}
                setState={setState}
                onApplyFilters={handleApplyFilters}
            />

            <TopTab.Navigator>
                <TopTab.Screen name="Map">
                    {props => <MapViewTab {...props} markers={markers} userLocation={location} />}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} markers={markers} userLocation={location} />}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
