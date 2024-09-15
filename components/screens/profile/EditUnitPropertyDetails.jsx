import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    ActivityIndicator,
    TouchableOpacity,
    Modal, Alert
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import { AuthContext } from "../../auth/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from "@react-navigation/native";
import ModalSelector from "react-native-modal-selector";
import {styles} from "./propertyDetails.style";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditRoomPropertyDetails = () => {
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

    const { propertyId, type, deleteProperty } = route.params;

    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this property?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteProperty().then(() => {
                            navigation.goBack();
                        }).catch(error => {
                            console.error('Error deleting property:', error);
                        });
                    }
                }
            ]
        )
    }

    useEffect(() => {
        const fetchRoomDetails = async () => {
            console.log("fetching unit details ", propertyId, type);
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

    const handleDateChange = (value) => {
        const startdate = new Date(value);
        const enddate = new Date(startdate);
        enddate.setDate(startdate.getDate() + 7); // Add 7 days to the start date

        const updatedRoom = {...room, startdate, enddate};
        setRoom(updatedRoom);
        setDatePickerVisibility(false);
    };

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
                body: JSON.stringify({
                    type,
                    ...room
                }),
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

                <Text style={styles.label}>Number of Rooms *</Text>
                <TextInput
                    style={[styles.input, errors.rooms ? styles.inputError : null]}
                    placeholder="Enter Number of Rooms"
                    value={room.rooms.toString()}
                    onChangeText={(rooms) => handleTextChange(rooms, 'rooms')}
                    keyboardType="numeric"
                />
                {errors.rooms && <Text style={styles.errorText}>{errors.rooms}</Text>}

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
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bond Price *</Text>
                        <TextInput
                            style={[styles.input, errors.price ? styles.inputError : null]}
                            placeholder="Enter Bond Price"
                            value={room.bondprice.toString()}
                            onChangeText={(bondprice) => handleTextChange(bondprice, 'price')}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Room Type */}


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

                {/*                <View style={styles.rowContainer}>
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
                        <Text style={styles.label}>Post Expiry Date *</Text>
                        <Text style={styles.info}>{room.enddate ? formatDate(room.enddate) : 'N/A'}</Text>
                    </View>
                </View>*/}

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
                            onChange={(event, startDate) => handleDateChange(startDate)}
                            onCancel={() => setDatePickerVisibility(false)}
                            minimumDate={new Date()}
                            maximumDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                            value={room.startDate || new Date()}/>}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Post Expiry Date *</Text>
                        <Text style={styles.info}>{room.enddate ? formatDate(room.enddate) : 'N/A'}</Text>
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


                <Button
                    title="Delete"
                    onPress={handleDelete}
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

export default EditRoomPropertyDetails;
