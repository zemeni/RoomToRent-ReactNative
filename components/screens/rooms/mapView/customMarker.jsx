// CustomMarker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomMarker = ({ price }) => {
    return (
        <View style={styles.markerContainer}>
            <View style={styles.badge}>
                <Text style={styles.priceText}>${price}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        backgroundColor: '#3498db',
        padding: 5,
        borderRadius: 10,
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CustomMarker;
