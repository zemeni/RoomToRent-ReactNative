// CustomMarker.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomMarker = ({ price , type}) => {
    const badgeColor = type === 'room' ? '#8030c1' : type === 'unit' ? 'rgba(225,12,150,0.85)' : '#3498db';
    return (
        <View style={styles.markerContainer}>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
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
        padding: 5,
        borderRadius: 10,
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CustomMarker;
