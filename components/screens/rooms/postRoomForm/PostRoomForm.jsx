import React, {useState, useEffect, useCallback} from 'react';
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
import {FontAwesome} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {styles} from "./postRoomForm.style";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Picker} from "@react-native-picker/picker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const DEFAULT_ROOM = {
    id: 1,
    type: 'room',
    price: 0,
    roomType: 'Single',
    including: '1',
    furnished: '1',
    description: '',
    bathrooms: 0,
    parkings: 0,
    startDate: '',
    phone1: '',
    phone2: '',
    gender: 'all',
    images: []
};

const PostRoomForm = ({onSubmit, onCancel}) => {
    const [rooms, setRooms] = useState([DEFAULT_ROOM]);
    const [address, setAddress] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const MAX_IMAGES = 5;

    const validateField = useCallback((field, value) => {
        switch (field) {
            case 'address':
                return value !== '';
            case 'price':
                return value > 0;
            case 'description':
                return value.length > 50;
            case 'startDate':
                return value instanceof Date && !isNaN(value.getTime());
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
        const isAddressValid = validateField("address", address);
        if (!isAddressValid) {
            errors.address = true;
        }

        const isFormValid = rooms.length > 0 && rooms.every(room => {
            let isRoomValid = true;
            ['price', 'description', 'bathrooms', 'parkings', 'startDate', 'images', 'phone1'].forEach(field => {
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
    }, [address, rooms, validateField]);

    useEffect(() => {
        validateForm();
    }, [rooms, address, validateForm]);

    const handleNumericChange = (value, roomId, field) => {
        const numericValue = Math.max(0, parseInt(value, 10) || 0);
        const updatedRooms = rooms.map(room => (room.id === roomId ? {...room, [field]: numericValue} : room));
        setRooms(updatedRooms);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const handleTextChange = (value, roomId, field) => {
        if (field === "address") {
            setAddress(value);
        } else {
            const updatedRooms = rooms.map(room => {
                if (room.id === roomId) {
                    const updatedRoom = {...room, [field]: value};
                    // If the field is 'startDate', calculate 'endDate' (available to)
                    if (field === 'startDate') {
                        const startDate = new Date(value);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + 7); // Add 7 days to the start date
                        updatedRoom.endDate = endDate;
                        setDatePickerVisibility(false);
                    }
                    return updatedRoom;
                }
                return room;
            });
            setRooms(updatedRooms);
        }
    };

    const pickImage = async (roomId) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            const updatedRooms = rooms.map(room => {
                if (room.id === roomId) {
                    const limitedImages = [...room.images, ...newImages].slice(0, MAX_IMAGES);
                    return {...room, images: limitedImages};
                }
                return room;
            });
            setRooms(updatedRooms);
        }
    };

    const removeImage = (roomId, uri) => {
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                return {...room, images: room.images.filter(image => image !== uri)};
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const addRoom = () => {
        const newRoomId = rooms.length + 1;
        const newRoom = {
            id: newRoomId,
            type: 'room',
            price: 0,
            roomType: 'Single',
            including: '1',
            furnished: '1',
            description: '',
            bathrooms: 0,
            parkings: 0,
            startDate: '',
            phone1: '',
            phone2: '',
            gender: 'all',
            images: []
        };
        setRooms([...rooms, newRoom]);
    };

    const removeRoom = (roomId) => {
        const updatedRooms = rooms.filter(room => room.id !== roomId);
        setRooms(updatedRooms);
    };

    const handleSubmit = () => {
        const updatedRooms = rooms.map(room => ({
            address: address,
            ...room
        }));
        console.log("before submitting ....", updatedRooms);
        onSubmit(updatedRooms);
    };

    const renderRoom = ({item: room}) => (
        <View key={room.id} style={styles.roomContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => removeRoom(room.id)}>
                <FontAwesome name="times-circle" size={30} color="red"/>
            </TouchableOpacity>
            <Text style={styles.formTitle}>Room {room.id}</Text>

            <Text style={styles.label}>Only for *</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={room.gender}
                    style={styles.picker}
                    onValueChange={(value) => handleTextChange(value, room.id, 'gender')}
                >
                    <Picker.Item label="Male" value="male"/>
                    <Picker.Item label="Female" value="female"/>
                    <Picker.Item label="Any Gender" value="all"/>
                </Picker>
            </View>


            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weekly Price *</Text>
                    <TextInput
                        style={[styles.input, validationErrors[room.id]?.price && styles.errorInput]}
                        placeholder="Enter Weekly Price"
                        value={room.price.toString()}
                        onChangeText={(price) => handleNumericChange(price, room.id, 'price')}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer1}>
                    <Text style={styles.label}>Including *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={room.including}
                            style={styles.picker}
                            onValueChange={(value) => handleTextChange(value, room.id, 'including')}
                        >
                            <Picker.Item label="Yes" value="1"/>
                            <Picker.Item label="No" value="0"/>
                        </Picker>
                    </View>
                </View>
            </View>
            {validationErrors[room.id]?.price &&
                <Text style={styles.errorText}>Price must be greater than 0.</Text>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Room Type *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={room.roomType}
                            style={styles.picker}
                            onValueChange={(value) => handleTextChange(value, room.id, 'roomType')}
                        >
                            <Picker.Item label="Single" value="Single"/>
                            <Picker.Item label="Double" value="Double"/>
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Furnished *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={room.furnished}
                            style={styles.picker}
                            onValueChange={(value) => handleTextChange(value, room.id, 'furnished')}
                        >
                            <Picker.Item label="Yes" value="1"/>
                            <Picker.Item label="No" value="0"/>
                        </Picker>
                    </View>
                </View>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter Description"
                value={room.description}
                onChangeText={(description) => handleTextChange(description, room.id, 'description')}
                multiline
            />
            {validationErrors[room.id]?.description &&
                <Text style={styles.errorText}>Description must be greater than 50 letters</Text>}
            <Text style={styles.label}>Number of Bathrooms *</Text>
            <TextInput
                style={[styles.input, validationErrors[room.id]?.bathrooms && styles.errorInput]}
                placeholder="Enter Number of Bathrooms"
                value={room.bathrooms.toString()}
                onChangeText={(bathrooms) => handleNumericChange(bathrooms, room.id, 'bathrooms')}
                keyboardType="numeric"
            />
            {validationErrors[room.id]?.bathrooms &&
                <Text style={styles.errorText}>Number of bathrooms must be greater than 0.</Text>}

            <Text style={styles.label}>Number of Parking Available *</Text>
            <TextInput
                style={[styles.input, validationErrors[room.id]?.parkings && styles.errorInput]}
                placeholder="Enter Number of Parkings"
                value={room.parkings.toString()}
                onChangeText={(parkings) => handleNumericChange(parkings, room.id, 'parkings')}
                keyboardType="numeric"
            />
            {validationErrors[room.id]?.parkings &&
                <Text style={styles.errorText}>Number of parking must be 0 or more.</Text>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}><Text style={styles.label}>Available from *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        onPress={() => showDatePicker()}
                    >
                        <Text>{room.startDate ? room.startDate.toLocaleDateString() : 'Select Date'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(startDate) => handleTextChange(startDate, room.id, 'startDate')}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    {validationErrors[room.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available date</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Available to *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        disabled={true}
                    >
                        <Text>{room.endDate ? room.endDate.toLocaleDateString() : 'Auto-filled'}</Text>
                    </TouchableOpacity>
                    {validationErrors[room.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available date</Text>}
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}><Text style={styles.label}>Phone1 *</Text>
                    <TextInput
                        style={[styles.input, validationErrors[room.id]?.phone1 && styles.errorInput]}
                        placeholder="phone 1"
                        value={room.phone1.toString()}
                        onChangeText={(phone1) => handleTextChange(phone1, room.id, 'phone1')}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}><Text style={styles.label}>Phone2</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="phone 2"
                        value={room.phone2.toString()}
                        onChangeText={(phone2) => handleTextChange(phone2, room.id, 'phone2')}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            {validationErrors[room.id]?.phone1 &&
                <Text style={styles.errorText}>At least one phone number is required.</Text>}

            <TouchableOpacity
                style={[styles.button, styles.uploadImage]}
                onPress={() => pickImage(room.id)}
            >
                <Text style={styles.buttonText}>{`Upload Room Images`}</Text>
            </TouchableOpacity>

            <ScrollView horizontal style={styles.imagePreviewContainer}>
                {room.images.map((uri) => (
                    <View key={uri} style={styles.imagePreview}>
                        <Image source={{uri}} style={styles.image}/>
                        <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(room.id, uri)}>
                            <FontAwesome name="times-circle" size={24} color="red"/>
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
                data={rooms}
                renderItem={renderRoom}
                keyExtractor={(room) => room.id.toString()}
                ListHeaderComponent={
                    <>
                        <Text style={styles.label}>Address *</Text>
                        <GooglePlacesAutocomplete
                            placeholder="Your Unit Address"
                            onPress={(data) => {
                                handleTextChange(data.description, null, 'address');
                            }}
                            query={{
                                key: '',
                                language: 'en',
                                components: {country: 'au'}
                            }}
                            styles={{textInput: {flex: 1, backgroundColor: '#d0d4d8'}}}
                        />
                        {validationErrors.address && <Text style={styles.errorText}>Address is required.</Text>}
                    </>
                }
                ListFooterComponent={
                    rooms.length > 0 && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={addRoom}
                            >
                                <Text style={styles.buttonText}>{`Add Room ${rooms.length + 1}`}</Text>
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
                    )
                }
                keyboardShouldPersistTaps={"handled"}
            />
        </KeyboardAvoidingView>
    );
};

export default PostRoomForm;
