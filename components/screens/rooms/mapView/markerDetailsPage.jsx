import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const MarkerDetailsPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { propertyId, type } = route.params;

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    console.log("room id in Marker Details Page is", propertyId);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/property/${propertyId}`, {
                    params: {
                        type: type
                    }
                });
                setRoom(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room details:', error);
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [propertyId, type]);

    const handleImagePress = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!room) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading room details.</Text>
                <Button title="Back to List" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    console.log("room details in markerDetailsPage are ", room);

    return (
        <View style={styles.container}>
            <ScrollView>

                {/* Address */}
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.info}>{room.address}</Text>

                {/* Only for */}
                {room.type === 'room' && <View>
                    <Text style={styles.label}>Available for:</Text>
                    <Text style={styles.info}>{room.gender === 'all' ? 'All Gender' : room.gender}</Text>
                </View>}

                {/* Weekly Price and Including */}
                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Weekly Price:</Text>
                        <Text style={styles.info}>${room.price}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Including:</Text>
                        <Text style={styles.info}>{room.including ? 'Yes' : 'No'}</Text>
                    </View>
                </View>

                {/* Room Type and Furnished */}
                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Room Type:</Text>
                        <Text style={styles.info}>{room.roomtype}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Furnished:</Text>
                        <Text style={styles.info}>{room.furnished ? 'Yes' : 'No'}</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.info}>{room.description}</Text>

                {/* Number of Bathrooms */}
                <Text style={styles.label}>Number of Bathrooms:</Text>
                <Text style={styles.info}>{room.bathrooms}</Text>

                {/* Number of Parkings */}
                <Text style={styles.label}>Number of Parkings:</Text>
                <Text style={styles.info}>{room.parkings}</Text>

                {/* Available from and Available to */}
                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Available From:</Text>
                        <Text style={styles.info}>{new Date(room.startdate).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Available To:</Text>
                        <Text style={styles.info}>{new Date(room.enddate).toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Phone 1 and Phone 2 */}
                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Phone 1:</Text>
                        <Text style={styles.info}>{room.phone1}</Text>
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.label}>Phone 2:</Text>
                        <Text style={styles.info}>{room.phone2 || 'N/A'}</Text>
                    </View>
                </View>

                {/* Images */}
                {/*<Text style={styles.label}>Images:</Text>
                 <ScrollView horizontal style={styles.imageContainer}>
                    {room.images.map((uri, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(uri)}>
                            <Image source={{ uri }} style={styles.imageThumbnail} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>*/}
            </ScrollView>

            <Button title="Back" onPress={() => navigation.goBack()} />

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
        backgroundColor: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
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
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    flexColumn: {
        flex: 1,
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

export default MarkerDetailsPage;
