import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {View, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import {TextInput} from 'react-native-paper';
import { styles } from './room.style';
import MapViewTab from './mapView/mapView';
import ListView from './listView/listView';
import SearchModal from "./modal/modal";

const markerData = require('./data/data.json');

const TopTab = createMaterialTopTabNavigator();

const Room = () => {
    const [visible, setVisible] = useState(false);
    const [suburb, setSuburb] = useState('');
    const [postcode, setPostcode] = useState('');
    const [state, setState] = useState('');
    const [markers, setMarkers] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        console.log("api call is made");
        if (filtersApplied) {
            // Load local JSON data directly using require
            setMarkers(markerData);
        }
    }, [filtersApplied]);

    const handleApplyFilters = () => {
        console.log("filter is applied");
        hideModal();
        setFiltersApplied(true); // Set filtersApplied to true after applying filters
    };

    console.log("room is rendered");

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
                    {props => <MapViewTab {...props} markers={markers} />}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} markers={markers} />}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
