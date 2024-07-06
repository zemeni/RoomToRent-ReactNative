import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./postRoomForm.style";

const PostRoomForm = ({ onSubmit, onCancel, handleRoomTypeChange }) => {
    const [rooms, setRooms] = useState([]);
    const [address, setAddress] = useState("");
    const [showSelectTypeMessage, setShowSelectTypeMessage] = useState(false);
    const [selectedType, setSelectedType] = useState('Room'); // Default to 'room'
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});

    const MAX_IMAGES = 5;

    useEffect(() => {
        const initialRoom = { id: 1, roomType: selectedType, price: 0, description: '', bathrooms: 0, parkings: 0, images: [] };
        setRooms([initialRoom]);
    }, []);

    useEffect(() => {
        console.log("inside use effect");
        if(rooms.length === 0 && showSelectTypeMessage) {
            handleRoomTypeChange('');
        }
    }, [rooms.length]);

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
        const isAddressValid = validateField("address", address);

        if(!isAddressValid) {
            errors.address = true;
        }

        const isFormValid = rooms.length > 0 && rooms.every(room => {
            let isRoomValid = true;
            ['address', 'price', 'bathrooms', 'parkings', 'images'].forEach(field => {
                if (!validateField(field, room[field])) {
                    isRoomValid = false;
                    errors[room.id] = errors[room.id] || {};
                    errors[room.id][field] = true;
                }
            });
            return isRoomValid && isAddressValid;
        });
        setValidationErrors(errors);
        setIsSubmitDisabled(!isFormValid);
    };

    useEffect(() => {
        validateForm();
    }, [rooms]);

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
        if (field === "address") {
            setAddress(value);
        }
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
        if(updatedRooms.length === 0)
            setShowSelectTypeMessage(true);
    };

    const handleSubmit = () => {
        const consolidatedData = [{address}, ...rooms];
        console.log("rooms ", consolidatedData);
        onSubmit(consolidatedData);
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
                <Text style={styles.label}>Address *</Text>
                <TextInput
                    style={[styles.input]}
                    placeholder="Enter Address"
                    value={address}
                    onChangeText={(address) => handleTextChange(address, 0, 'address')}
                />
                {validationErrors.address && <Text style={styles.errorText}>Address is required.</Text>}
                {rooms.map(room => (
                    <View key={room.id} style={styles.roomContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => removeRoom(room.id)}>
                            <FontAwesome name="times-circle" size={30} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.formTitle}>Room {room.id}</Text>

                        <Text style={styles.label}>Price *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.price && styles.errorInput]}
                            placeholder="Enter Price"
                            value={room.price.toString()}
                            onChangeText={(price) => handleNumericChange(price, room.id, 'price')}
                            keyboardType="numeric"
                        />
                        {validationErrors[room.id]?.price && <Text style={styles.errorText}>Price must be greater than 0.</Text>}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Enter Description"
                            value={room.description}
                            onChangeText={(description) => handleTextChange(description, room.id, 'description')}
                            multiline
                        />
                        <Text style={styles.label}>Number of Bathrooms *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.bathrooms && styles.errorInput]}
                            placeholder="Enter Number of Bathrooms"
                            value={room.bathrooms.toString()}
                            onChangeText={(bathrooms) => handleNumericChange(bathrooms, room.id, 'bathrooms')}
                            keyboardType="numeric"
                        />
                        {validationErrors[room.id]?.bathrooms && <Text style={styles.errorText}>Number of bathrooms must be greater than 0.</Text>}
                        <Text style={styles.label}>Number of Parkings *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[room.id]?.parkings && styles.errorInput]}
                            placeholder="Enter Number of Parkings"
                            value={room.parkings.toString()}
                            onChangeText={(parkings) => handleNumericChange(parkings, room.id, 'parkings')}
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
                {rooms.length > 0 && (
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
