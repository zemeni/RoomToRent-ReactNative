import React, { useRef } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const MarkerModal = ({ visible, marker, closeModal }) => {
    const translateY = useRef(new Animated.Value(600)).current; // Initial translateY value

    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true }
    );

    const handleGestureEnd = (event) => {
        if (event.nativeEvent.translationY > 100) {
            closeModal(); // Close modal if dragged down more than 100 units
        } else {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={styles.overlay} />

            <PanGestureHandler
                onGestureEvent={handleGestureEvent}
                onHandlerStateChange={handleGestureEnd}
            >
                <Animated.View
                    style={[styles.bottomSheet, { transform: [{ translateY: translateY }] }]}
                >
                    <View style={styles.handleBar} />
                    <View style={styles.content}>
                        <Text style={styles.modalTitle}>{marker?.title}</Text>
                        <Text>{marker?.description}</Text>
                        <Text>Latitude: {marker?.coordinate.latitude}</Text>
                        <Text>Longitude: {marker?.coordinate.longitude}</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        minHeight: 200, // Adjust minimum height as needed
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        borderRadius: 2.5,
        marginTop: 10,
    },
    content: {
        marginTop: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default MarkerModal;
