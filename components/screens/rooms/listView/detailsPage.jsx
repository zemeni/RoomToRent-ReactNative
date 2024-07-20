import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetailsPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { room } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImagePress = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Room Details</Text>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.info}>{room.address}</Text>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.info}>${room.price}</Text>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.info}>{room.description}</Text>
                <Text style={styles.label}>Bathrooms:</Text>
                <Text style={styles.info}>{room.bathrooms}</Text>
                <Text style={styles.label}>Parkings:</Text>
                <Text style={styles.info}>{room.parkings}</Text>
                <Text style={styles.label}>Images:</Text>
                <ScrollView horizontal style={styles.imageContainer}>
                    {room.images.map((uri, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
                            <Image source={{ uri }} style={styles.imageThumbnail} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>
            <Button title="Back to List" onPress={() => navigation.goBack()} />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
                        <Text style={styles.modalCloseText}>X</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    imageThumbnail: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalImage: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
    },
    modalCloseText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default DetailsPage;
