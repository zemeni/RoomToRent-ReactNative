import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    Modal
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import { AuthContext } from "../../auth/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from "@react-navigation/native";
import ModalSelector from "react-native-modal-selector";
import {styles} from "./profileDetails.style";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditProfileDetails = () => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [initialRoom, setInitialRoom] = useState(null); // New state to track initial room data
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    const { propertyId, type, onClose } = route.params;

    const genderOptions = [
        { key: 'male', label: 'Male' },
        { key: 'female', label: 'Female' },
        { key: 'all', label: 'Any Gender' },
    ]

    const includingOptions = [
        { key: 'true', label: 'Yes' },
        { key: 'false', label: 'No' },
    ];

    const roomTypeOptions = [
        { key: 'Single', label: 'Single' },
        { key: 'Double', label: 'Double' },
    ];

    const furnishedOptions = [
        { key: 'true', label: 'Yes' },
        { key: 'false', label: 'No' },
    ];

    useEffect(() => {
        const fetchRoomDetails = async () => {
            console.log("fetching room details ", propertyId, type);
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/property/${propertyId}`, {
                    params: { type: type }
                });
                setRoom(response.data);
                setInitialRoom(response.data); // Set initial room data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching room details:', error);
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [propertyId, type]);

    useEffect(() => {
        const isChanged = JSON.stringify(room) !== JSON.stringify(initialRoom);
        setIsUpdateDisabled(Object.keys(errors).length > 0 || !isChanged);
    }, [errors, room, initialRoom]);

    const handleTextChange = (value, field) => {
        console.log(field, value);
        const updatedRoom = { ...room, [field]: value };

        let newErrors = { ...errors };

        if (field === 'price' || field === 'bathrooms') {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue <= 0) {
                newErrors[field] = `${field} must be greater than 0`;
            } else {
                delete newErrors[field];
            }
        }

        if (field === 'phone1') {
            const phoneRegex = /^04\d{8}$/; // Example for Australian mobile numbers
            if (!phoneRegex.test(value)) {
                newErrors.phone1 = 'Phone1 must be a valid mobile number starting with 04';
            } else {
                delete newErrors.phone1;
            }
        }

        if (field === 'description' && value.trim().length < 50) {
            newErrors.description = 'Description must be greater than 50 words';
        } else {
            delete newErrors.description;
        }

        if (field === 'startdate') {
            const startdate = new Date(value);
            const enddate = new Date(startdate);
            enddate.setDate(startdate.getDate() + 7); // Add 7 days to the start date
            updatedRoom.enddate = enddate;
            setDatePickerVisibility(false);
        }

        setErrors(newErrors);
        setRoom(updatedRoom);
    };


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const updateProperty = async () => {
        console.log("updating property ", room);
        setSaving(true);
        try {
            const response = await fetch(`http://192.168.1.108:4000/api/property/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.token
                },
                body: JSON.stringify(room),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Close the modal and return to the previous screen
           navigation.goBack();
        } catch (error) {
            console.error('Error saving room details:', error);
        } finally {
            setSaving(false);
        }
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

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    console.log("room details ", room);

    return (
        <View style={styles.container}>
            <ScrollView>

                {/* Address */}
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.info}>{room.address}</Text>

                {/* Available For */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Available for *</Text>
                    <View style={styles.pickerContainer}>
                        <ModalSelector data={genderOptions}
                                       onChange={(option) => handleTextChange(option.key, 'gender')}
                                       >
                            <View style={styles.dropdown}>
                                <Text style={styles.inputText}>
                                    {genderOptions.find(g => g.key === room.gender)?.label || 'Select Gender'}
                                </Text>
                                <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                            </View>
                        </ModalSelector>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Weekly Price *</Text>
                        <TextInput
                            style={[styles.input, errors.price ? styles.inputError : null]}
                            placeholder="Enter Weekly Price"
                            value={room.price.toString()}
                            onChangeText={(price) => handleTextChange(price, 'price')}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer1}>
                        <Text style={styles.label}>Including *</Text>
                        <View style={styles.pickerContainer}>
                            <ModalSelector
                                data={includingOptions}
                                onChange={(option) => handleTextChange(option.key, 'including')}
                            >
                                <View style={styles.dropdown}>
                                    <Text style={styles.inputText}>
                                        {includingOptions.find(i => i.key === room.including.toString())?.label || 'Select Option'}
                                    </Text>
                                    <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                                </View>
                            </ModalSelector>
                        </View>
                    </View>
                </View>
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Room Type */}
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Room Type *</Text>
                        <View style={styles.pickerContainer}>
                            <ModalSelector
                                data={roomTypeOptions}
                                onChange={(option) => handleTextChange(option.key, 'roomType')}
                            >
                                <View style={styles.dropdown}>
                                    <Text style={styles.inputText}>
                                        {roomTypeOptions.find(rt => rt.key === room.roomtype)?.label || 'Select Room Type'}
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
                                onChange={(option) => handleTextChange(option.key, 'furnished')}
                            >
                                <View style={styles.dropdown}>
                                    <Text style={styles.inputText}>
                                        {furnishedOptions.find(f => f.key === room.furnished.toString())?.label || 'Select Furnished'}
                                    </Text>
                                    <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                                </View>
                            </ModalSelector>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={[styles.input, errors.description ? styles.inputError : null]}
                    multiline
                    value={room.description}
                    onChangeText={(description) => handleTextChange(description, 'description')}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <Text style={styles.label}>Number of Bathrooms *</Text>
                <TextInput
                    style={[styles.input, errors.bathrooms ? styles.inputError : null]}
                    placeholder="Enter Number of Bathrooms"
                    value={room.bathrooms.toString()}
                    onChangeText={(bathrooms) => handleTextChange(bathrooms, 'bathrooms')}
                    keyboardType="numeric"
                />
                {errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms}</Text>}

                <Text style={styles.label}>Number of Parking Available *</Text>
                <TextInput
                    style={[styles.input, errors.parkings ? styles.inputError : null]}
                    placeholder="Enter Number of Parkings"
                    value={room.parkings.toString()}
                    onChangeText={(parkings) => handleTextChange(parkings, 'parkings')}
                    keyboardType="numeric"
                />
                {errors.parkings && <Text style={styles.errorText}>{errors.parkings}</Text>}

                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available from *</Text>
                        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>
                                {room.startdate ? formatDate(room.startdate) : 'Select Date'}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(date) => handleTextChange(date.toISOString(), 'startdate')}
                            onCancel={() => setDatePickerVisibility(false)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available to *</Text>
                        <Text style={styles.info}>{room.enddate ? formatDate(room.enddate) : 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}><Text style={styles.label}>Available from *</Text>
                        <TouchableOpacity
                            style={[styles.input, styles.datePickerInput]}
                            onPress={() => showDatePicker()}
                        >
                            <Text>{room.startdate ? formatDate(room.startdate) : 'Select Date'}</Text>
                        </TouchableOpacity>
                        {isDatePickerVisible && <DateTimePicker
                            mode="date"
                            onChange={(startDate) => handleTextChange(startDate.toISOString(), 'startdate')}
                            onCancel={() => setDatePickerVisibility(false)}
                            minimumDate={new Date()}
                            maximumDate={new Date(Date.now() + 60 *24 *60 *60 *1000)}
                            value={room.startDate || new Date()}/>}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available to *</Text>
                        <TouchableOpacity
                            style={[styles.input, styles.datePickerInput]}
                            disabled={true}
                        >
                            <Text>{room.endDate ? room.endDate.toLocaleDateString() : 'Auto-filled'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}><Text style={styles.label}>Phone1 *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="phone 1"
                            value={room.phone1.toString()}
                            onChangeText={(phone1) => handleTextChange(phone1, 'phone1')}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}><Text style={styles.label}>Phone2</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="phone 2"
                            value={room.phone2.toString()}
                            onChangeText={(phone2) => handleTextChange(phone2, 'phone2')}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                {errors.phone1 && <Text style={styles.errorText}>{errors.phone1}</Text>}

                <Button
                    title="Update"
                    onPress={updateProperty}
                    disabled={isUpdateDisabled}
                />
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            ></Modal>
        </View>
    );
};

export default EditProfileDetails;
