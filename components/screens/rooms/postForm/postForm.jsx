import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/Ionicons';
import PostRoomForm from '../postRoomForm/PostRoomForm';
import PostUnitForm from '../postUnitForm/postUnitForm';

const PostForm = ({ onSubmit, onCancel }) => {
    const [selectedType, setSelectedType] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleRoomTypeChange = (option) => {
        setSelectedType(option.key);
        setShowForm(true);
    };

    const SelectedFormComponent = selectedType === 'room' ? PostRoomForm : selectedType === 'unit' ? PostUnitForm : null;

    const propertyTypes = [
        { key: 'room', label: 'Room' },
        { key: 'unit', label: 'Unit' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            {!showForm && (
                <>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <FontAwesome name="times-circle" size={30} color="red" />
                    </TouchableOpacity>

                    <View style={styles.roomSelection}>
                        <Text style={styles.label}>Select Property Type</Text>
                        <ModalSelector data={propertyTypes} onChange={handleRoomTypeChange}>
                            <View style={styles.dropdown}>
                                <Text style={styles.inputText}>
                                    {propertyTypes.find(p => p.key === selectedType)?.label || 'Select Type'}
                                </Text>
                                <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                            </View>
                        </ModalSelector>
                    </View>
                </>
            )}

            {showForm && SelectedFormComponent && (
                <SelectedFormComponent
                    handleRoomTypeChange={handleRoomTypeChange}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 10,
    },
    cancelButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 10,
        right: 25,
        zIndex: 1,
    },
    roomSelection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        paddingLeft: 15,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#5a87ca',
        height: 40,
    },
    inputText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownIcon: {
        marginLeft: 10,
    },
});

export default PostForm;
