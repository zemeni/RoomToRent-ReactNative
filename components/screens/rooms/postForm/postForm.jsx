import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import PostRoomForm from '../postRoomForm/PostRoomForm';
import PostUnitForm from '../postUnitForm/postUnitForm';

const PostForm = () => {
    const [selectedType, setSelectedType] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleRoomTypeChange = (value) => {
        setSelectedType(value);
        setShowForm(true); // Show the form after selecting a type
    };

    const handleCancel = () => {
        setSelectedType('');
        setShowForm(false); // Hide the form when canceling
        oncancel();
    };

    const SelectedFormComponent = selectedType === 'room' ? PostRoomForm : selectedType === 'unit' ? PostUnitForm : null;

    return (
        <>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <FontAwesome name="times-circle" size={30} color="red"/>
            </TouchableOpacity>
            <View style={styles.roomSelection}>
                <Text style={styles.label}>Select Property Type</Text>
                <Picker
                    selectedValue={selectedType}
                    style={styles.input}
                    onValueChange={handleRoomTypeChange}
                >
                    <Picker.Item label="Select Type" value=""/>
                    <Picker.Item label="Room" value="room"/>
                    <Picker.Item label="Unit" value="unit"/>
                    {/* Add more options for other room types */}
                </Picker>
            </View>
            {showForm && SelectedFormComponent && <SelectedFormComponent handleRoomTypeChange={handleRoomTypeChange}/>}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    roomSelection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default PostForm;
