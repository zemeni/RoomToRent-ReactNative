import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import PostRoomForm from '../postRoomForm/PostRoomForm';
import PostUnitForm from '../postUnitForm/postUnitForm';

const PostForm = ({onSubmit, onCancel}) => {
    const [selectedType, setSelectedType] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleRoomTypeChange = (value) => {
        setSelectedType(value);
        setShowForm(true); // Show the form after selecting a type
    };

    const handleCancel = () => {
        onCancel();
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
            {showForm && SelectedFormComponent && <SelectedFormComponent handleRoomTypeChange={handleRoomTypeChange} onSubmit={onSubmit}/>}
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
        top: 20,
        right: 25,
        zIndex: 1,
    },
    roomSelection: {
        marginBottom: 20,

    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 20,
        paddingLeft: 15,
        // backgroundColor: '#f8f7f7',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#dadada',
    },
});

export default PostForm;
