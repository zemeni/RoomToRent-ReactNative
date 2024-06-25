import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from './mapView.style';

const MapViewTab = ({ markers }) => {
    const [region, setRegion] = useState({latitude: -33.9246,
        longitude: 151.0930,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,});
    const [location, setLocation] = useState({latitude: -33.9246, longitude:151.0930});

    useEffect(() => {
        (async () => {
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
            setRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
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
        </View>
    );
};

export default MapViewTab;
