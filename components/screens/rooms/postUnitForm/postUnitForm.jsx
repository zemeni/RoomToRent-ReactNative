import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./postUnitForm.style";

const PostUnitForm = ({ onSubmit, onCancel, handleRoomTypeChange }) => {
    const [units, setUnits] = useState([]);
    const [showSelectTypeMessage, setShowSelectTypeMessage] = useState(false);
    const [selectedType, setSelectedType] = useState('room'); // Default to 'room'
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});

    const MAX_IMAGES = 5;

    useEffect(() => {
        const initialRoom = { id: 1, roomType: selectedType, address: '', price: 0, description: '', bathrooms: 0, parkings: 0, images: [] };
        setUnits([initialRoom]);
    }, []);

    useEffect(() => {
        console.log("inside use effect");
        if(units.length === 0 && showSelectTypeMessage) {
            handleRoomTypeChange('');
        }
    }, [units]);

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
        const isFormValid = units.length > 0 && units.every(room => {
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
    }, [units]);

    const handleNumericChange = (value, roomId, field) => {
        let numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
            numericValue = 0;
        }
        if (numericValue < 0) {
            numericValue = 0;
        }
        const updatedRooms = units.map(room => {
            if (room.id === roomId) {
                return { ...room, [field]: numericValue };
            }
            return room;
        });
        setUnits(updatedRooms);
    };

    const handleTextChange = (value, roomId, field) => {
        const updatedRooms = units.map(room => {
            if (room.id === roomId) {
                return { ...room, [field]: value };
            }
            return room;
        });
        setUnits(updatedRooms);
    };

    const pickImage = async (roomId) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.cancelled) {
            const newImages = result.assets.map(asset => asset.uri);
            const updatedRooms = units.map(room => {
                if (room.id === roomId) {
                    const limitedImages = [...room.images, ...newImages].slice(0, MAX_IMAGES);
                    return { ...room, images: limitedImages };
                }
                return room;
            });
            setUnits(updatedRooms);
        }
    };

    const removeImage = (roomId, uri) => {
        const updatedRooms = units.map(room => {
            if (room.id === roomId) {
                return { ...room, images: room.images.filter(image => image !== uri) };
            }
            return room;
        });
        setUnits(updatedRooms);
    };

    const addRoom = () => {
        const newRoomId = units.length + 1;
        const newRoom = { id: newRoomId, roomType: selectedType, address: '', price: 0, description: '', bathrooms: 0, parkings: 0, images: [] };
        setUnits([...units, newRoom]);
    };

    const removeRoom = (roomId) => {
        const updatedRooms = units.filter(room => room.id !== roomId);
        setUnits(updatedRooms);
        if(updatedRooms.length === 0)
            setShowSelectTypeMessage(true);
    };

    const handleSubmit = () => {
        onSubmit(units);
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
                {units.map(unit => (
                    <View key={unit.id} style={styles.roomContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => removeRoom(unit.id)}>
                            <FontAwesome name="times-circle" size={30} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.formTitle}>Unit {unit.id}</Text>
                        <Text style={styles.label}>Address *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[unit.id]?.address && styles.errorInput]}
                            placeholder="Enter Address"
                            value={unit.address}
                            onChangeText={(text) => handleTextChange(text, unit.id, 'address')}
                        />
                        {validationErrors[unit.id]?.address && <Text style={styles.errorText}>Address is required.</Text>}
                        <Text style={styles.label}>Price *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[unit.id]?.price && styles.errorInput]}
                            placeholder="Enter Price"
                            value={unit.price.toString()}
                            onChangeText={(text) => handleNumericChange(text, unit.id, 'price')}
                            keyboardType="numeric"
                        />
                        {validationErrors[unit.id]?.price && <Text style={styles.errorText}>Price must be greater than 0.</Text>}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder="Enter Description"
                            value={unit.description}
                            onChangeText={(text) => handleTextChange(text, unit.id, 'description')}
                            multiline
                        />
                        <Text style={styles.label}>Number of Bathrooms *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[unit.id]?.bathrooms && styles.errorInput]}
                            placeholder="Enter Number of Bathrooms"
                            value={unit.bathrooms.toString()}
                            onChangeText={(text) => handleNumericChange(text, unit.id, 'bathrooms')}
                            keyboardType="numeric"
                        />
                        {validationErrors[unit.id]?.bathrooms && <Text style={styles.errorText}>Number of bathrooms must be greater than 0.</Text>}
                        <Text style={styles.label}>Number of Parkings *</Text>
                        <TextInput
                            style={[styles.input, validationErrors[unit.id]?.parkings && styles.errorInput]}
                            placeholder="Enter Number of Parkings"
                            value={unit.parkings.toString()}
                            onChangeText={(text) => handleNumericChange(text, unit.id, 'parkings')}
                            keyboardType="numeric"
                        />
                        {validationErrors[unit.id]?.parkings && <Text style={styles.errorText}>Number of parkings must be 0 or more.</Text>}
                        <Button title="Upload Images" onPress={() => pickImage(unit.id)} />
                        <ScrollView horizontal style={styles.imagePreviewContainer}>
                            {unit.images.map((uri) => (
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
                {units.length > 0 && (
                    <View style={styles.buttonContainer}>
                        <Button title={`Add Unit ${units.length + 1}`} onPress={addRoom} />
                        <Button title="Submit" onPress={handleSubmit} disabled={isSubmitDisabled} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PostUnitForm;
