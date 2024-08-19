import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {AuthContext} from "../../auth/AuthContext";

const EditMarkerDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {propertyId, type, openModal} = route.params;

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [initialRoom, setInitialRoom] = useState(null); // New state to track initial room data
    const {user} = useContext(AuthContext);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/property/${propertyId}`, {
                    params: {type: type}
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
        // Disable the update button if there are any errors or no changes have been made
        const isChanged = JSON.stringify(room) !== JSON.stringify(initialRoom);
        setIsUpdateDisabled(Object.keys(errors).length > 0 || !isChanged);
    }, [errors, room, initialRoom]);

    const handleTextChange = (value, field) => {
        console.log(field, value);
        const updatedRoom = {...room, [field]: value};

        // Validation
        if (field === 'price' || field === 'bathrooms') {
            const numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue <= 0) {
                setErrors(prevErrors => ({...prevErrors, [field]: `${field} must be greater than 0`}));
            } else {
                setErrors(prevErrors => {
                    const newErrors = {...prevErrors};
                    delete newErrors[field];
                    return newErrors;
                });
            }
        }

        if (field === 'description' && value.trim().length < 50) {
            setErrors(prevErrors => ({...prevErrors, description: 'Description must be greater than 50 words'}));
        } else {
            setErrors(prevErrors => {
                const newErrors = {...prevErrors};
                delete newErrors.description;
                return newErrors;
            });
        }

        if (field === 'startdate') {
            const startdate = new Date(value);
            const enddate = new Date(startdate);
            enddate.setDate(startdate.getDate() + 7); // Add 7 days to the start date
            updatedRoom.enddate = enddate;
            setDatePickerVisibility(false);
        }

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

            /*if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }*/

            navigation.reset({
                index: 0,
                routes: [{ name: 'MyProfile' }],
            });
        } catch (error) {
            console.error('Error saving room details:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    if (!room) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading room details.</Text>
                <Button title="Back to List" onPress={() => navigation.goBack()}/>
            </View>
        );
    }

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
                        <Picker
                            selectedValue={room.gender}
                            style={styles.picker}
                            onValueChange={(value) => handleTextChange(value, 'gender')}
                        >
                            <Picker.Item label="Male" value="male"/>
                            <Picker.Item label="Female" value="female"/>
                            <Picker.Item label="Any Gender" value="all"/>
                        </Picker>
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
                            <Picker
                                selectedValue={room.including}
                                style={styles.picker}
                                onValueChange={(value) => handleTextChange(value, 'including')}
                            >
                                <Picker.Item label="Yes" value="1"/>
                                <Picker.Item label="No" value="0"/>
                            </Picker>
                        </View>
                    </View>
                </View>
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Room Type */}
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Room Type *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={room.roomType}
                                style={styles.picker}
                                onValueChange={(value) => handleTextChange(value, 'roomType')}
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
                                onValueChange={(value) => handleTextChange(value, 'furnished')}
                            >
                                <Picker.Item label="Yes" value="1"/>
                                <Picker.Item label="No" value="0"/>
                            </Picker>
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
                    <View style={styles.inputContainer}><Text style={styles.label}>Available from *</Text>
                        <TouchableOpacity
                            style={[styles.input, styles.datePickerInput]}
                            onPress={() => showDatePicker()}
                        >
                            <Text style={styles.datePickerText}>{formatDate(room.startdate)}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(startDate) => handleTextChange(startDate, 'startdate')}
                            onCancel={() => setDatePickerVisibility(false)}
                        />
                        {/*{errors.startdate &&
                            <Text style={styles.errorText}>Select Available date</Text>}*/}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Available to *</Text>
                        <TouchableOpacity
                            style={[styles.input, styles.datePickerInput]}
                            disabled={true}
                        >
                            <Text style={styles.datePickerText}>{formatDate(room.enddate)}</Text>
                        </TouchableOpacity>
                        {/*{validationErrors[room.id]?.startDate &&
                            <Text style={styles.errorText}>Select Available date</Text>}*/}
                    </View>
                </View>

                <Button
                    title={saving ? "Saving..." : "Update"}
                    onPress={updateProperty}
                    disabled={isUpdateDisabled || saving}
                    color="#007bff"
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    inputError: {
        borderColor: 'red',
    },
    inputContainer: {
        flex: 1,
    },
    inputContainer1: {
        flex: 1,
        marginLeft: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    picker: {
        height: 40,
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    datePickerInput: {
        justifyContent: 'center',
    },
    datePickerText: {
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditMarkerDetails;
