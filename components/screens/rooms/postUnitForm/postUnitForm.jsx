import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./postUnitForm.style";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PostUnitForm = ({ onSubmit, onCancel }) => {
    const [units, setUnits] = useState([{
        id: 1,
        type: "unit",
        address: "",
        price: 0,
        bondPrice: 0,
        rooms: 0,
        description: '',
        bathrooms: 0,
        parkings: 0,
        startDate: '',
        phone1: '',
        phone2: '',
        images: []
    }]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const MAX_IMAGES = 5;

    const validateField = useCallback((field, value) => {
        switch (field) {
            case 'address':
                return value !== '';
            case 'price':
                return value > 0;
            case 'bondPrice':
                return value > 0;
            case 'rooms':
                return value > 0;
            case 'startDate':
                return value instanceof Date && !isNaN(value.getTime());
            case 'description':
                return value.length > 50;
            case 'bathrooms':
                return value > 0;
            case 'parkings':
                return value >= 0;
            case 'phone1':
                const phoneRegex = /^04\d{8}$/;
                return phoneRegex.test(value);
            case 'images':
                return value.length <= MAX_IMAGES;
            default:
                return true;
        }
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};

        const isFormValid = units.length > 0 && units.every(unit => {
            let isUnitValid = true;
            ['address', 'price', 'rooms', 'startDate', 'bathrooms', 'description', 'parkings', 'images', 'phone1'].forEach(field => {
                if (!validateField(field, unit[field])) {
                    isUnitValid = false;
                    errors[unit.id] = errors[unit.id] || {};
                    errors[unit.id][field] = true;
                }
            });
            return isUnitValid;
        });

        setValidationErrors(errors);
        setIsSubmitDisabled(!isFormValid);
    }, [units, validateField]);

    useEffect(() => {
        validateForm();
    }, [units, validateForm]);

    const handleNumericChange = (value, unitId, field) => {
        const numericValue = Math.max(0, parseInt(value, 10) || 0);
        const updatedUnits = units.map(unit => (unit.id === unitId ? { ...unit, [field]: numericValue } : unit));
        setUnits(updatedUnits);
    };

    const handleTextChange = (value, unitId, field) => {
        const updatedUnits = units.map(unit => {
            if (unit.id === unitId) {
                const updatedUnit = { ...unit, [field]: value };
                if (field === 'startDate') {
                    const startDate = new Date(value);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 7);
                    updatedUnit.endDate = endDate;
                    setDatePickerVisibility(false);
                }
                return updatedUnit;
            }
            return unit;
        });
        setUnits(updatedUnits);
    };

    const pickImage = async (unitId) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            const updatedUnits = units.map(unit => {
                if (unit.id === unitId) {
                    const limitedImages = [...unit.images, ...newImages].slice(0, MAX_IMAGES);
                    return { ...unit, images: limitedImages };
                }
                return unit;
            });
            setUnits(updatedUnits);
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const removeImage = (unitId, uri) => {
        const updatedUnits = units.map(unit => {
            if (unit.id === unitId) {
                return { ...unit, images: unit.images.filter(image => image !== uri) };
            }
            return unit;
        });
        setUnits(updatedUnits);
    };

    const addUnit = () => {
        const newUnitId = units.length + 1;
        const newUnit = {
            id: newUnitId,
            type: 'unit',
            address: '',
            price: 0,
            bondPrice: 0,
            rooms: 0,
            description: '',
            bathrooms: 0,
            parkings: 0,
            startDate:'',
            phone1:'',
            phone2:'',
            images: []
        };
        setUnits([...units, newUnit]);
    };

    const removeUnit = (unitId) => {
        const updatedUnits = units.filter(unit => unit.id !== unitId);
        setUnits(updatedUnits);
    };

    const handleSubmit = () => {
        console.log("submitting data ", units);
        onSubmit(units);
    };

    const handleAddressSelect = (unitId, data) => {
        const updatedUnits = units.map(unit => (
            unit.id === unitId ? { ...unit, address: data.description } : unit
        ));
        setUnits(updatedUnits);
    };

    const renderUnit = ({ item: unit }) => (
        <View key={unit.id} style={styles.unitContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => removeUnit(unit.id)}>
                <FontAwesome name="times-circle" size={30} color="red" />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Unit {unit.id}</Text>

            <Text style={styles.label}>Address *</Text>
            <GooglePlacesAutocomplete
                placeholder="Enter Unit Address"
                onPress={(data) => handleAddressSelect(unit.id, data)}
                query={{
                    key: '', // Your Google API Key
                    language: 'en',
                    components: { country: 'au' }
                }}
                styles={{ textInput: { flex: 1, backgroundColor: '#8d9dae' } }}
            />
            {validationErrors[unit.id]?.address && <Text style={styles.errorText}>Address is required.</Text>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weekly Price *</Text>
                    <TextInput
                        style={[styles.input, validationErrors[unit.id]?.price && styles.errorInput]}
                        placeholder="Enter Weekly Price"
                        value={unit.price.toString()}
                        onChangeText={(price) => handleNumericChange(price, unit.id, 'price')}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bond Price *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Bond Price"
                        value={unit.bondPrice.toString()}
                        onChangeText={(bondPrice) => handleNumericChange(bondPrice, unit.id, 'bondPrice')}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            {validationErrors[unit.id]?.price &&
                <Text style={styles.errorText}>Price must be greater than 0.</Text>}

            <Text style={styles.label}>Number of Rooms *</Text>
            <TextInput
                style={[styles.input, validationErrors[unit.id]?.rooms && styles.errorInput]}
                placeholder="Enter Total Rooms"
                value={unit.rooms.toString()}
                onChangeText={(rooms) => handleNumericChange(rooms, unit.id, 'rooms')}
                keyboardType="numeric"
            />
            {validationErrors[unit.id]?.rooms &&
                <Text style={styles.errorText}>Number of rooms must be greater than 0.</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter Description"
                value={unit.description}
                onChangeText={(description) => handleTextChange(description, unit.id, 'description')}
                multiline
            />
            {validationErrors[unit.id]?.description &&
                <Text style={styles.errorText}>Description must be greater than 50 letters</Text>}

            <Text style={styles.label}>Bathrooms *</Text>
            <TextInput
                style={[styles.input, validationErrors[unit.id]?.bathrooms && styles.errorInput]}
                placeholder="Enter Number of Bathrooms"
                value={unit.bathrooms.toString()}
                onChangeText={(bathrooms) => handleNumericChange(bathrooms, unit.id, 'bathrooms')}
                keyboardType="numeric"
            />
            {validationErrors[unit.id]?.bathrooms &&
                <Text style={styles.errorText}>Number of bathrooms must be greater than 0.</Text>}

            <Text style={styles.label}>Parkings *</Text>
            <TextInput
                style={[styles.input, validationErrors[unit.id]?.parkings && styles.errorInput]}
                placeholder="Enter Number of Parkings"
                value={unit.parkings.toString()}
                onChangeText={(parkings) => handleNumericChange(parkings, unit.id, 'parkings')}
                keyboardType="numeric"
            />
            {validationErrors[unit.id]?.parkings &&
                <Text style={styles.errorText}>Number of parkings must be greater than or equal to 0.</Text>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}><Text style={styles.label}>Available from *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        onPress={() => showDatePicker()}
                    >
                        <Text>{unit.startDate ? unit.startDate.toLocaleDateString() : 'Select Date'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(startDate) => handleTextChange(startDate, unit.id, 'startDate')}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    {validationErrors[unit.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available date</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Available to *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        disabled={true}
                    >
                        <Text>{unit.endDate ? unit.endDate.toLocaleDateString() : 'Auto-filled'}</Text>
                    </TouchableOpacity>
                    {validationErrors[unit.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available date</Text>}
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}><Text style={styles.label}>Phone1 *</Text>
                    <TextInput
                        style={[styles.input, validationErrors[unit.id]?.phone1 && styles.errorInput]}
                        placeholder="phone 1"
                        value={unit.phone1.toString()}
                        onChangeText={(phone1) => handleTextChange(phone1, unit.id, 'phone1')}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}><Text style={styles.label}>Phone2</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="phone 2"
                        value={unit.phone2.toString()}
                        onChangeText={(phone2) => handleTextChange(phone2, unit.id, 'phone2')}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            {validationErrors[unit.id]?.phone1 &&
                <Text style={styles.errorText}>At least one phone number is required.</Text>}

            <TouchableOpacity
                style={styles.button}
                onPress={()=>pickImage(unit.id)}
            >
                <Text style={styles.buttonText}>{`Upload Unit Images`}</Text>
            </TouchableOpacity>

            <ScrollView horizontal>
                {unit.images.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(unit.id, uri)}
                        >
                            <FontAwesome name="times-circle" size={30} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <Text>You can upload up to {MAX_IMAGES} images.</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <FlatList
                data={units}
                renderItem={renderUnit}
                keyExtractor={(unit) => unit.id.toString()}
                ListFooterComponent={
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={addUnit}
                        >
                            <Text style={styles.buttonText}>{`Add Unit ${units.length + 1}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, isSubmitDisabled && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={isSubmitDisabled}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                }
                keyboardShouldPersistTaps={"handled"}
            />
        </KeyboardAvoidingView>
    );
};

export default PostUnitForm;
