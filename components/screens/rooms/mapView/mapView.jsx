import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, TouchableOpacity, Text, Modal} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
import {styles} from './mapView.style';
import {AuthContext} from '../../../auth/AuthContext';
import {useNavigation} from '@react-navigation/native';
import PostForm from "../postForm/postForm";
import Toast from "react-native-toast-message";
import CustomMarker from "./customMarker";
import { Ionicons } from '@expo/vector-icons';

const MapViewTab = ({markers, mapLocation, userLocation, fetchRoomData}) => {
    const [mapType, setMapType] = useState('standard');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isMapTypeModalVisible, setIsMapTypeModalVisible] = useState(false);
    const mapRef = useRef(null);
    const {user} = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (mapRef.current && mapLocation) {
            mapRef.current.animateToRegion({
                latitude: mapLocation.latitude,
                longitude: mapLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }, 1000);
        }
    }, [mapLocation]);

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

    const handlePostRoom = () => {
        if (!user) {
            navigation.navigate('Login');
        } else {
            setIsFormVisible(true); // Show the form
        }
    };

    const handleFormSubmit = async (formData) => {
        setIsFormVisible(false);
        try {
            const response = await fetch('http://192.168.1.108:4000/api/property', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                return false;
            }

            Toast.show({
                type: 'success',
                position: 'top',
                text1: `Property Added Successfully`,
                text2: 'Check your profile for your properties',
                visibilityTime: 3000,
            });
            if(fetchRoomData) {
                await fetchRoomData();
            }
            return true;
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Server Error',
                text2: 'Try again later',
                visibilityTime: 5000,
            });
            return false;
        }
    };

    const handleFormCancel = () => {
        setIsFormVisible(false);
    };

    const handleMarkerPress = (marker) => {
        navigation.navigate('MarkerDetailsPage', {propertyId: marker.id, type: marker.type});
    };

    // Toggle map type modal visibility
    const toggleMapTypeModal = () => {
        setIsMapTypeModalVisible(!isMapTypeModalVisible);
    };

    // Set the map type and close the modal
    const selectMapType = (type) => {
        setMapType(type);
        setIsMapTypeModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={mapLocation ? {
                    latitude: mapLocation.latitude,
                    longitude: mapLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                } : null}
                showsUserLocation={true}
                showsMyLocationButton={false}
                mapType={mapType}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        onPress={() => handleMarkerPress(marker)}
                    >
                        <CustomMarker price={marker.price} type={marker.type}/>
                    </Marker>
                ))}
            </MapView>

            {/* Single button for map type modal */}
            <View style={styles.topRight}>
                <TouchableOpacity onPress={toggleMapTypeModal} style={styles.mapTypeButton}>
                    <FontAwesome name="map" size={24} color="#0533ed"/>
                </TouchableOpacity>
            </View>

            {/* Modal for map type selection */}
            <Modal
                visible={isMapTypeModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => selectMapType('standard')}>
                            <View style={styles.mapTypeOption}>
                                <Ionicons name="map-outline" size={24} color="#1c3fcc" />
                                <Text style={styles.mapTypeText}>Standard</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectMapType('satellite')}>
                            <View style={styles.mapTypeOption}>
                                <Ionicons name="planet-outline" size={24} color="#1c3fcc" />
                                <Text style={styles.mapTypeText}>Satellite</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectMapType('hybrid')}>
                            <View style={styles.mapTypeOption}>
                                <Ionicons name="layers-outline" size={24} color="#1c3fcc" />
                                <Text style={styles.mapTypeText}>Hybrid</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleMapTypeModal}>
                            <View style={styles.mapTypeOption}>
                                <Ionicons name="close-circle-outline" size={24} color="red" />
                                <Text style={styles.mapTypeCancel}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Reset to current location button */}
            <View style={styles.bottomRight}>
                <TouchableOpacity style={styles.resetButton} onPress={resetToCurrentLocation}>
                    <FontAwesome5 name="location-arrow" size={30} color="#3e5dd8"/>
                </TouchableOpacity>
            </View>

            {/* Post Room/Units Button */}
            <TouchableOpacity style={styles.postButton} onPress={handlePostRoom}>
                <Text style={styles.postButtonText}>Post Room/Units</Text>
            </TouchableOpacity>

            {/* Form Modal */}
            <Modal visible={isFormVisible} animationType="slide">
                <PostForm onSubmit={handleFormSubmit} onCancel={handleFormCancel}/>
            </Modal>
        </View>
    );
};

export default MapViewTab;
