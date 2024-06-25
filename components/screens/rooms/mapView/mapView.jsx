import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from './mapView.style';

const MapViewTab = ({ markers, userLocation }) => {
    const [region, setRegion] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (userLocation) {
            setRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [userLocation]);

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

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
            >
{/*                {userLocation && (
                    <Marker coordinate={userLocation} title="You are here" />
                )}*/}
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
            </MapView>
            <TouchableOpacity style={styles.resetButton} onPress={resetToCurrentLocation}>
                <Text style={styles.resetButtonText}>Reset Location</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MapViewTab;
