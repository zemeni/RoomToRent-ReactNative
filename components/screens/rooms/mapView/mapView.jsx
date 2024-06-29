import React, { useState, useRef, useContext } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome, MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'; // Import icons
import { styles } from './mapView.style';

import { AuthContext } from '../../../../service/AuthContext';
import { useNavigation } from '@react-navigation/native';
import PostRoomForm from '../PostRoomForm'; // Import the form component

const MapViewTab = ({ markers, userLocation }) => {
    const [mapType, setMapType] = useState('standard'); // Default map type
    const [isFormVisible, setIsFormVisible] = useState(false);
    const mapRef = useRef(null);

    const { user } = useContext(AuthContext);
    const navigation = useNavigation();

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
            navigation.navigate('Login', { fromScreen: 'Rooms' });
        } else {
            setIsFormVisible(true); // Show the form
        }
    };

    const handleFormSubmit = (formData) => {
        console.log('Form Data:', formData);
        setIsFormVisible(false);
        // Add logic to handle form submission
    };

    const handleFormCancel = () => {
        setIsFormVisible(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={userLocation ? {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                } : null}
                showsUserLocation={true}
                showsMyLocationButton={false}
                mapType={mapType === 'standard' ? 'standard' : mapType === 'satellite' ? 'satellite' : 'hybrid'}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
            </MapView>
            <View style={styles.topRight}>
                <TouchableOpacity onPress={() => toggleMapType('standard')} style={styles.mapTypeButton}>
                    <FontAwesome name="street-view" size={24} color={mapType === 'standard' ? '#b305ed' : '#0533ed'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleMapType('satellite')} style={styles.mapTypeButton}>
                    <MaterialIcons name="satellite" size={24} color={mapType === 'satellite' ? '#b305ed' : '#0533ed'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleMapType('hybrid')} style={styles.mapTypeButton}>
                    <FontAwesome5 name="map-marked" size={24} color={mapType === 'hybrid' ? '#b305ed' : '#0533ed'} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomRight}>
                <TouchableOpacity style={styles.resetButton} onPress={resetToCurrentLocation}>
                    <FontAwesome6 name="location-crosshairs" size={30} color="#3e5dd8" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.postButton} onPress={handlePostRoom}>
                <Text style={styles.postButtonText}>Post Room</Text>
            </TouchableOpacity>
            <Modal visible={isFormVisible} animationType="slide">
                <PostRoomForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
            </Modal>
        </View>
    );
};

export default MapViewTab;
