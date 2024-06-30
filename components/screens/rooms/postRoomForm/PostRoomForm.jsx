import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {styles} from "./postRoomForm.style";

const PostRoomForm = ({ onSubmit, onCancel }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});

    const MAX_IMAGES = 5;

    const validateField = (field, value) => {
        switch (field) {
            case 'address':
                return value !== '';
            case 'price':
                return value > 0;
            case 'bathrooms':
                return value > 0;
            case 'parkings':
                return value >= 0;
            case 'images':
                return value.length <= MAX_IMAGES;
            default:
                return true;
        }
    };

    // Function to validate the form
    const validateForm = () => {
        const errors = {};
        const isFormValid = rooms.length > 0 && rooms.every(room => {
            let isValid = true;
            ['address', 'price', 'bathrooms', 'parkings', 'images'].forEach(field => {
                if (!validateField(field, room[field])) {
                    isValid = false;
                    errors[room.id] = errors[room.id] || {};
                    errors[room.id][field] = true;
                }
            });
            return isValid;
        });
        setValidationErrors(errors);
        setIsSubmitDisabled(!isFormValid);
    };

    useEffect(() => {
        validateForm();
    }, [rooms]);

    const handleRoomTypeChange = (itemValue) => {
        setSelectedType(itemValue);
        setRooms([]);
        if (itemValue === 'room') {
            addRoom();
        }
    };

    const handleNumericChange = (value, roomId, field) => {
        let numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
            numericValue = 0;
        }
        if (numericValue < 0) {
            numericValue = 0;
        }
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return { ...room, [field]: numericValue };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const handleTextChange = (value, roomId, field) => {
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return { ...room, [field]: value };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

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
                    const limitedImages = [...room.images, ...newImages].slice(0, MAX_IMAGES);
                    return { ...room, images: limitedImages };
                }
                return room;
            });
            setRooms(updatedRooms);
        }
    };

    const removeImage = (roomId, uri) => {
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return { ...room, images: room.images.filter(image => image !== uri) };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const addRoom = () => {
        const newRoomId = rooms.length + 1;
        const newRoom = { id: newRoomId, roomType: selectedType, address: '', price: 0, description: '', bathrooms: 0, parkings: 0, images: [] };
        setRooms([...rooms, newRoom]);
    };

    const removeRoom = (roomId) => {
        const updatedRooms = rooms.filter(room => room.id !== roomId);
        setRooms(updatedRooms);
    };

    const handleSubmit = () => {
        onSubmit(rooms);
    };

    const handleCancel = () => {
        onCancel();
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
                        selectedValue={selectedType}
                        style={styles.input}
                        onValueChange={handleRoomTypeChange}
                    >
                        <Picker.Item label="Select Room Type" value="" />
                        <Picker.Item label="Room" value="room" />
                        <Picker.Item label="Unit" value="unit" />
                        {/* Add more options for other room types */}
                    </Picker>
                </View>
                {rooms.map(room => (
                    <View key={room.id} style={styles.roomContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => removeRoom(room.id)}>
                            <FontAwesome name="times-circle" size={30} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.formTitle}>Room {room.id}</Text>
                        <Text style={styles.label}>Address *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.address && styles.errorInput]}
                            placeholder="Enter Address"
                            value={room.address}
                            onChangeText={(text) => handleTextChange(text, room.id, 'address')}
                        />
                        {validationErrors[room.id]?.address && <Text style={styles.errorText}>Address is required.</Text>}
                        <Text style={styles.label}>Price *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.price && styles.errorInput]}
                            placeholder="Enter Price"
                            value={room.price.toString()}
                            onChangeText={(text) => handleNumericChange(text, room.id, 'price')}
                            keyboardType="numeric"
                        />
                        {validationErrors[room.id]?.price && <Text style={styles.errorText}>Price must be greater than 0.</Text>}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Enter Description"
                            value={room.description}
                            onChangeText={(text) => handleTextChange(text, room.id, 'description')}
                            multiline
                        />
                        <Text style={styles.label}>Number of Bathrooms *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.bathrooms && styles.errorInput]}
                            placeholder="Enter Number of Bathrooms"
                            value={room.bathrooms.toString()}
                            onChangeText={(text) => handleNumericChange(text, room.id, 'bathrooms')}
                            keyboardType="numeric"
                        />
                        {validationErrors[room.id]?.bathrooms && <Text style={styles.errorText}>Number of bathrooms must be greater than 0.</Text>}
                        <Text style={styles.label}>Number of Parkings *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.parkings && styles.errorInput]}
                            placeholder="Enter Number of Parkings"
                            value={room.parkings.toString()}
                            onChangeText={(text) => handleNumericChange(text, room.id, 'parkings')}
                            keyboardType="numeric"
                        />
                        {validationErrors[room.id]?.parkings && <Text style={styles.errorText}>Number of parkings must be 0 or more.</Text>}
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
                        <Text>You can upload up to {MAX_IMAGES} images.</Text>
                    </View>
                ))}
                {selectedType === 'room' && rooms.length === 0 && (
                    <>
                        {handleRoomTypeChange('')}
                        <Text style={styles.noRoomsMessage}>Select 'Room' to start adding rooms.</Text>
                    </>
                )}
                {selectedType === 'room' && rooms.length > 0 && (
                    <View style={styles.buttonContainer}>
                        <Button title={`Add Room ${rooms.length + 1}`} onPress={addRoom} />
                        <Button title="Submit" onPress={handleSubmit} disabled={isSubmitDisabled} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PostRoomForm;
