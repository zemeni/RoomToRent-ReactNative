import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const PostRoomForm = ({ onSubmit, onCancel }) => {
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [bathrooms, setBathrooms] = useState(0);
    const [parkings, setParkings] = useState(0);
    const [images, setImages] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        const isFormValid = selectedRoomType && address && price && description && bathrooms && parkings && images.length <= 5;
        setIsSubmitDisabled(!isFormValid);
    }, [selectedRoomType, address, price, description, bathrooms, parkings, images]);

    const handleStepChange = (value, setValue) => {
        if (!isNaN(value)) {
            setValue(parseInt(value));
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            const totalImages = images.length + newImages.length;

            if (totalImages > 5) {
                Alert.alert('Image Limit Exceeded', 'You can only upload up to 5 images.');
                setImages([...images, ...newImages.slice(0, 5 - images.length)]);
            } else {
                setImages([...images, ...newImages]);
            }
        }
    };

    const removeImage = (uri) => {
        setImages(images.filter(image => image !== uri));
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.label}>Room Type</Text>
                <Picker
                    selectedValue={selectedRoomType}
                    style={styles.input}
                    onValueChange={(itemValue) => setSelectedRoomType(itemValue)}
                >
                    <Picker.Item label="Select Room Type" value="" />
                    <Picker.Item label="Single Room" value="single" />
                    <Picker.Item label="Double Room" value="double" />
                    <Picker.Item label="Apartment" value="apartment" />
                </Picker>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Enter Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <Text style={styles.label}>Number of Bathrooms</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Number of Bathrooms"
                    value={bathrooms}
                    onChangeText={(text) => handleStepChange(text, setBathrooms)}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>Number of Parkings</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Number of Parkings"
                    value={parkings}
                    onChangeText={(text) => handleStepChange(text, setParkings)}
                    keyboardType="numeric"
                />
                <Button title="Upload Images" onPress={pickImage} />
                <ScrollView horizontal style={styles.imagePreviewContainer}>
                    {images.map((uri) => (
                        <View key={uri} style={styles.imagePreview}>
                            <Image source={{ uri }} style={styles.image} />
                            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(uri)}>
                                <FontAwesome name="times-circle" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="Submit" onPress={() => onSubmit({ selectedRoomType, address, price, description, bathrooms, parkings, images })} disabled={isSubmitDisabled} />
                    <Button title="Cancel" onPress={onCancel} color="red" />
                </View>
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
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 80,  // Increased height for the description field
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    imagePreview: {
        position: 'relative',
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default PostRoomForm;
