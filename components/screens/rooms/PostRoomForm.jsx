import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const PostRoomForm = ({ onSubmit, onCancel }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    // Function to handle changes in numeric fields (bathrooms and parkings)
    const handleStepChange = (value, setValue) => {
        if (!isNaN(value)) {
            setValue(parseInt(value));
        }
    };

    // Function to pick images for a specific room
    const pickImage = async (roomId) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.cancelled) {
            const newImages = result.assets.map(asset => asset.uri);
            const updatedRooms = rooms.map(room => {
                if (room.id === roomId) {
                    // Limit to 5 images per room
                    const limitedImages = newImages.slice(0, 5);
                    return { ...room, images: [...limitedImages] };
                }
                return room;
            });
            setRooms(updatedRooms);
            validateForm(); // Validate form after adding images
        }
    };

    // Function to remove an image from a specific room
    const removeImage = (roomId, uri) => {
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return { ...room, images: room.images.filter(image => image !== uri) };
            }
            return room;
        });
        setRooms(updatedRooms);
        validateForm(); // Validate form after removing images
    };

    // Function to add a new room
    const addRoom = () => {
        const newRoomId = rooms.length + 1;
        const newRoom = { id: newRoomId, roomType: selectedRoomType, address: '', price: '', description: '', bathrooms: 0, parkings: 0, images: [] };
        setRooms([...rooms, newRoom]);
        validateForm(); // Validate form after adding a room
    };

    // Function to remove a room
    const removeRoom = (roomId) => {
        const updatedRooms = rooms.filter(room => room.id !== roomId);
        setRooms(updatedRooms);
        validateForm(); // Validate form after removing a room
    };

    // Function to handle form submission
    const handleSubmit = () => {
        onSubmit(rooms);
    };

    // Function to handle cancel action
    const handleCancel = () => {
        onCancel();
    };

    // Function to validate the form
    const validateForm = () => {
        const isFormValid = rooms.length > 0 && rooms.every(room => {
            return room.roomType === 'room' && room.address !== '' && room.price !== '' && room.bathrooms !== 0 && room.parkings !== 0 && room.images.length <= 5;
        });
        setIsSubmitDisabled(!isFormValid);
    };

    // Function to handle room type change
    const handleRoomTypeChange = (itemValue) => {
        setSelectedRoomType(itemValue);
        setRooms([]); // Clear existing rooms when changing room type
        if (itemValue === 'room') {
            // Automatically add the first room when 'Room' is selected
            addRoom();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <FontAwesome name="times-circle" size={30} color="red" />
                </TouchableOpacity>
                <View style={styles.roomSelection}>
                    <Text style={styles.label}>Select Room Type</Text>
                    <Picker
                        selectedValue={selectedRoomType}
                        style={styles.input}
                        onValueChange={handleRoomTypeChange}
                    >
                        <Picker.Item label="Select Room Type" value="" />
                        <Picker.Item label="Room" value="room" />
                        {/* Add more options for other room types */}
                    </Picker>
                </View>
                {rooms.map(room => (
                    <View key={room.id} style={styles.roomContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => removeRoom(room.id)}>
                            <FontAwesome name="times-circle" size={30} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.formTitle}>Room {room.id}</Text>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Address"
                            value={room.address}
                            onChangeText={(text) => {
                                const updatedRooms = rooms.map(r => {
                                    if (r.id === room.id) {
                                        return { ...r, address: text };
                                    }
                                    return r;
                                });
                                setRooms(updatedRooms);
                                validateForm(); // Validate form on input change
                            }}
                        />
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Price"
                            value={room.price}
                            onChangeText={(text) => {
                                const updatedRooms = rooms.map(r => {
                                    if (r.id === room.id) {
                                        return { ...r, price: text };
                                    }
                                    return r;
                                });
                                setRooms(updatedRooms);
                                validateForm(); // Validate form on input change
                            }}
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Enter Description"
                            value={room.description}
                            onChangeText={(text) => {
                                const updatedRooms = rooms.map(r => {
                                    if (r.id === room.id) {
                                        return { ...r, description: text };
                                    }
                                    return r;
                                });
                                setRooms(updatedRooms);
                            }}
                            multiline
                        />
                        <Text style={styles.label}>Number of Bathrooms</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Bathrooms"
                            value={room.bathrooms.toString()}
                            onChangeText={(text) => {
                                handleStepChange(text, (value) => {
                                    const updatedRooms = rooms.map(r => {
                                        if (r.id === room.id) {
                                            return { ...r, bathrooms: value };
                                        }
                                        return r;
                                    });
                                    setRooms(updatedRooms);
                                    validateForm(); // Validate form on input change
                                });
                            }}
                            keyboardType="numeric"
                        />
                        <Text style={styles.label}>Number of Parkings</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Parkings"
                            value={room.parkings.toString()}
                            onChangeText={(text) => {
                                handleStepChange(text, (value) => {
                                    const updatedRooms = rooms.map(r => {
                                        if (r.id === room.id) {
                                            return { ...r, parkings: value };
                                        }
                                        return r;
                                    });
                                    setRooms(updatedRooms);
                                    validateForm(); // Validate form on input change
                                });
                            }}
                            keyboardType="numeric"
                        />
                        <Button title="Upload Images" onPress={() => pickImage(room.id)} />
                        <ScrollView horizontal style={styles.imagePreviewContainer}>
                            {room.images.map((uri) => (
                                <View key={uri} style={styles.imagePreview}>
                                    <Image source={{ uri }} style={styles.image} />
                                    <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(room.id, uri)}>
                                        <FontAwesome name="times-circle" size={24} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ))}
                {selectedRoomType === 'room' && rooms.length === 0 && (
                    <Text style={styles.noRoomsMessage}>Select 'Room' to start adding rooms.</Text>
                )}
                {selectedRoomType === 'room' && rooms.length > 0 && (
                    <View style={styles.buttonContainer}>
                        <Button title={`Add Room ${rooms.length + 1}`} onPress={addRoom} />
                        <Button title="Submit" onPress={handleSubmit} disabled={isSubmitDisabled} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    roomSelection: {
        marginBottom: 20,
    },
    roomContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        position: 'relative', // Ensure relative positioning for Cancel button alignment
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 80, // Increased height for multiline description input
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    imagePreview: {
        marginRight: 10,
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    noRoomsMessage: {
        marginTop: 10,
        fontStyle: 'italic',
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
});

export default PostRoomForm;
