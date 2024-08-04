import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, TouchableOpacity, Text, Modal, Dimensions} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {FontAwesome, MaterialIcons, FontAwesome5, FontAwesome6} from '@expo/vector-icons'; // Import icons
import {styles} from './mapView.style';

import {AuthContext} from '../../../auth/AuthContext';
import {useNavigation} from '@react-navigation/native';
import PostForm from "../postForm/postForm";
import Toast from "react-native-toast-message";
import CustomMarker from "./customMarker";


const MapViewTab = ({markers, userLocation}) => {
    const [mapType, setMapType] = useState('satellite'); // Default map type
    const [isFormVisible, setIsFormVisible] = useState(false);
    const mapRef = useRef(null);

    const [markerPosition, setMarkerPosition] = useState(null);
    const [radius, setRadius] = useState(1000);

    const {user} = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        setMarkerPosition(null);
    }, []);

    const resetToCurrentLocation = () => {
        if (mapRef.current && userLocation) {
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }, 1000);
        }
    };

    const toggleMapType = (type) => {
        setMapType(type);
    };

    const handlePostRoom = () => {
        if (!user) {
            navigation.navigate('Login', {fromScreen: 'Rooms'});
        } else {
            setIsFormVisible(true); // Show the form
        }
    };

    const handleFormSubmit = async (formData) => {
        console.log('Form Data:', formData);
        setIsFormVisible(false);
        console.log("token is ", user.token);
        try {
            const response = await fetch('http://192.168.1.108:4000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            console.log("response is ", data);

            if (!response.ok) {
                console.error("Server error:", data.message || response.statusText);
                return false;
            }

            Toast.show({
                type: 'success',
                position: 'top',
                text1: `Room Added Successfully`,
                text2: 'Check your profile for your entries',
                visibilityTime: 5000,
            });
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Server Error',
                text2: 'Try again next time',
                visibilityTime: 5000,
            });
            return false;
        }
    };

    const handleFormCancel = () => {
        setIsFormVisible(false);
    };

    const handleMapPress = (event) => {
        console.log("map is pressed");
        const {latitude, longitude} = event.nativeEvent.coordinate;
        setMarkerPosition({latitude, longitude});
    };

    const handleMarkerDragEnd = (event) => {
        const {latitude, longitude} = event.nativeEvent.coordinate;
        setMarkerPosition({latitude, longitude});
    };

    const handleSearch = async () => {
        const searchParams = {
            latitude: markerPosition.latitude,
            longitude: markerPosition.longitude,
            radius: radius,
        };

        console.log("search params is ", searchParams);
    };

    const handleMarkerPress = (marker) => {
        navigation.navigate('MarkerDetailsPage', {roomId: marker.id})
    }


    console.log("rendering map view page");

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={userLocation ? {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                } : null}
                showsUserLocation={true}
                showsMyLocationButton={false}
                mapType={mapType === 'standard' ? 'standard' : mapType === 'satellite' ? 'satellite' : 'hybrid'}
                onPress={handleMapPress}
            >
                {/* DON'T REMOVE {markerPosition && (
                    <>
                        <Marker
                            coordinate={markerPosition}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                        />
                        <Circle
                            center={markerPosition}
                            radius={radius}
                            strokeWidth={2}
                            strokeColor={'#1a66ff'}
                            fillColor={'rgba(230,238,255,0.5)'}
                        />
                    </>
                )}*/}
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        // description={marker.description}
                        onPress={() => handleMarkerPress(marker)}
                    >
                        <CustomMarker price={marker.title.split(' ')[1]} />
                    </Marker>
                ))}
            </MapView>
            <View style={styles.topRight}>
                <TouchableOpacity onPress={() => toggleMapType('standard')} style={styles.mapTypeButton}>
                    <FontAwesome name="street-view" size={24} color={mapType === 'standard' ? '#b305ed' : '#0533ed'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleMapType('satellite')} style={styles.mapTypeButton}>
                    <MaterialIcons name="satellite" size={24} color={mapType === 'satellite' ? '#b305ed' : '#0533ed'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleMapType('hybrid')} style={styles.mapTypeButton}>
                    <FontAwesome5 name="map-marked" size={24} color={mapType === 'hybrid' ? '#b305ed' : '#0533ed'}/>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomRight}>
                <TouchableOpacity style={styles.resetButton} onPress={resetToCurrentLocation}>
                    <FontAwesome6 name="location-crosshairs" size={30} color="#3e5dd8"/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.postButton} onPress={handlePostRoom}>
                <Text style={styles.postButtonText}>Post Room/Units</Text>
            </TouchableOpacity>
            <Modal visible={isFormVisible} animationType="slide">
                <PostForm onSubmit={handleFormSubmit} onCancel={handleFormCancel}/>
            </Modal>
            {/* DON'T REMOVE {markerPosition && (
                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={1000}
                        maximumValue={5000}
                        value={radius}
                        onValueChange={value => setRadius(value)}
                        minimumTrackTintColor="#1a66ff"
                        maximumTrackTintColor="#fff"
                        thumbTintColor="#1a66ff"
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            )}*/}
        </View>
    );
};

export default MapViewTab;
