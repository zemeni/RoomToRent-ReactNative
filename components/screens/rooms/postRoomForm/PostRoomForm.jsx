import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';;
import {styles} from "./postRoomForm.style";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import ModalSelector from "react-native-modal-selector";


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
    gender: 'all'
};

const PostRoomForm = ({onSubmit, onCancel}) => {
    const [rooms, setRooms] = useState([DEFAULT_ROOM]);
    const [address, setAddress] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const genderOptions = [
        { key: 'male', label: 'Male' },
        { key: 'female', label: 'Female' },
        { key: 'all', label: 'Any Gender' },
    ];

    const includingOptions = [
        { key: '1', label: 'Yes' },
        { key: '0', label: 'No' },
    ];

    const roomTypeOptions = [
        { key: 'Single', label: 'Single' },
        { key: 'Double', label: 'Double' },
    ];

    const furnishedOptions = [
        { key: '1', label: 'Yes' },
        { key: '0', label: 'No' },
    ];

    const validateField = useCallback((field, value) => {
        switch (field) {
            case 'address':
                return value !== '';
            case 'price':
                return value > 0 && value < 1000;
            case 'description':
                return value.length > 30 && value.length < 200;
            case 'startDate':
                return value instanceof Date && !isNaN(value.getTime());
            case 'bathrooms':
                return value > 0 && value < 5;
            case 'parkings':
                return value >= 0 && value < 5;
            case 'phone1':
                const phoneRegex = /^04\d{8}$/;
                return phoneRegex.test(value);
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
            ['price', 'description', 'bathrooms', 'parkings', 'startDate', 'phone1'].forEach(field => {
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

    const handleDateChange = (selectedDate, roomId) => {
        const newDate = new Date(selectedDate);
        const updatedRooms = rooms.map(room => {
            if (room.id === roomId) {
                const updatedRoom = { ...room, startDate: newDate };

                // Calculate and set endDate
                const endDate = new Date(newDate);
                endDate.setDate(newDate.getDate() + 7); // Add 7 days to the start date
                updatedRoom.endDate = endDate;

                setDatePickerVisibility(false);
                return updatedRoom;
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const handleTextChange = (value, roomId, field) => {
        if (field === "address") {
            setAddress(value);
        } else {
            const updatedRooms = rooms.map(room => {
                if (room.id === roomId) {
                    return {...room, [field]: value};
                }
                return room;
            });
            setRooms(updatedRooms);
        }
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
            gender: 'all'
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

            <Text style={styles.label}>Only For *</Text>
            <View style={styles.pickerContainer}>
                <ModalSelector data={genderOptions}
                               onChange={(option) => handleTextChange(option.key, room.id, 'gender')}
                               >
                    <View style={styles.dropdown}>
                        <Text style={styles.inputText}>
                            {genderOptions.find(g => g.key === room.gender)?.label || 'Select Gender'}
                        </Text>
                        <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                    </View>
                </ModalSelector>
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

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Including *</Text>
                    <View style={styles.pickerContainer}>
                        <ModalSelector data={includingOptions}
                                       initValue={includingOptions.find(option => option.key === room.including)?.label || 'Select Option'}
                                       onChange={(option) => handleTextChange(option.key, room.id, 'including')}
                                       >
                            <View style={styles.dropdown}>
                                <Text style={styles.inputText}>
                                    {includingOptions.find(option => option.key === room.including)?.label || 'Select Option'}
                                </Text>
                                <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                            </View>
                        </ModalSelector>
                    </View>
                </View>
            </View>
            {validationErrors[room.id]?.price &&
                <Text style={styles.errorText}>Invalid price.</Text>}

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Room Type *</Text>
                    <View style={styles.pickerContainer}>
                        <ModalSelector
                            data={roomTypeOptions}
                            initValue={roomTypeOptions.find(option => option.key === room.roomType)?.label || 'Select Room Type'}
                            onChange={(option) => handleTextChange(option.key, room.id, 'roomType')}
                        >
                            <View style={styles.dropdown}>
                                <Text style={styles.inputText}>
                                    {roomTypeOptions.find(option => option.key === room.roomType)?.label || 'Select Room Type'}
                                </Text>
                                <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                            </View>
                        </ModalSelector>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Furnished *</Text>
                    <View style={styles.pickerContainer}>
                        <ModalSelector
                            data={furnishedOptions}
                            initValue={furnishedOptions.find(option => option.key === room.furnished)?.label || 'Select Option'}
                            onChange={(option) => handleTextChange(option.key, room.id, 'furnished')}
                        >
                            <View style={styles.dropdown}>
                                <Text style={styles.inputText}>
                                    {furnishedOptions.find(option => option.key === room.furnished)?.label || 'Select Option'}
                                </Text>
                                <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                            </View>
                        </ModalSelector>
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
                <Text style={styles.errorText}>Provide description 30 to 200 characters</Text>}
            <Text style={styles.label}>Number of Bathrooms *</Text>
            <TextInput
                style={[styles.input, validationErrors[room.id]?.bathrooms && styles.errorInput]}
                placeholder="Enter Number of Bathrooms"
                value={room.bathrooms.toString()}
                onChangeText={(bathrooms) => handleNumericChange(bathrooms, room.id, 'bathrooms')}
                keyboardType="numeric"
            />
            {validationErrors[room.id]?.bathrooms &&
                <Text style={styles.errorText}>Invalid numbers of bathrooms.</Text>}

            <Text style={styles.label}>Number of Parking Available *</Text>
            <TextInput
                style={[styles.input, validationErrors[room.id]?.parkings && styles.errorInput]}
                placeholder="Enter Number of Parkings"
                value={room.parkings.toString()}
                onChangeText={(parkings) => handleNumericChange(parkings, room.id, 'parkings')}
                keyboardType="numeric"
            />

            <View style={styles.rowContainer}>
                <View style={styles.inputContainer}><Text style={styles.label}>Available From *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        onPress={() => showDatePicker()}
                    >
                        <Text>{room.startDate ? room.startDate.toLocaleDateString() : 'Select Date'}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && <DateTimePicker
                        mode="date"
                        onChange={(event, startDate) => handleDateChange(startDate, room.id)}
                        onCancel={() => setDatePickerVisibility(false)}
                        minimumDate={new Date()}
                        maximumDate={new Date(Date.now() + 60 *24 *60 *60 *1000)}
                        value={room.startDate || new Date()}/>}
                    {validationErrors[room.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available From</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>This Post Expires On *</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.datePickerInput]}
                        disabled={true}
                    >
                        <Text>{room.endDate ? room.endDate.toLocaleDateString() : 'Auto-filled'}</Text>
                    </TouchableOpacity>
                    {validationErrors[room.id]?.startDate &&
                        <Text style={styles.errorText}>Select Available From</Text>}
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
                <Text style={styles.errorText}>Provide one phone number</Text>}
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
                                key: 'AIzaSyCUD4zx3oDyTCAISXtANyF-j8s2ayPHfSs',
                                language: 'en',
                                components: {country: 'au'}
                            }}
                            styles={{textInput: {flex: 1, ...Platform.select({
                                        ios: {
                                            backgroundColor: '#b3b5b6', // Placeholder text color for iOS
                                            color: '#131313'
                                        },
                                        android: {
                                            backgroundColor: '#ebeced', // Placeholder text color for Android
                                            color: '#131313'
                                        },
                                    }),}}}
                        />
                        {validationErrors.address && <Text style={styles.errorText}>Address is required.</Text>}
                    </>
                }
                ListFooterComponent={
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
                }
                keyboardShouldPersistTaps={"handled"}
            />
        </KeyboardAvoidingView>
    );
};

export default PostRoomForm;
