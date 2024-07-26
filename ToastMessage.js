import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ToastMessage = ({ visible, message, position }) => {
    if (!visible) {
        return null;
    }

    const containerStyle = [
        styles.container,
        position === 'bottom' ? styles.bottom : styles.center,
    ];

    return (
        <View style={containerStyle}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 5,
        zIndex: 1000,
        width: '80%',
        alignItems: 'center',
    },
    center: {
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    bottom: {
        bottom: 30,
        left: '50%',
        transform: [{ translateX: -50 }],
    },
    text: {
        color: 'white',
    },
});

export default ToastMessage;
