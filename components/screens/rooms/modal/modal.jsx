import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Modal, Portal } from 'react-native-paper';
import DropDownPicker from "react-native-dropdown-picker";
import { styles } from './modal.style';

const SearchModal = ({ visible, hideModal, suburb, postcode, state, setSuburb, setPostcode, setState, onApplyFilters }) => {
    const [tempSuburb, setTempSuburb] = useState(suburb);
    const [tempPostcode, setTempPostcode] = useState(postcode);
    const [tempState, setTempState] = useState(state);

    const [isOpen, setIsOpen] = useState(false);

    const dropdownItems = [
        { label: "SA", value: "SA" },
        { label: "VIC", value: "VIC" },
        { label: "NT", value: "NT" },
        { label: "NSW", value: "NSW" },
        { label: "WA", value: "WA" },
        { label: "TAS", value: "TAS" },
    ];

    useEffect(() => {
        // Reset tempSuburb and tempPostcode when tempState changes
        setTempSuburb('');
        setTempPostcode('');
    }, [tempState]);

    const handleApply = () => {
        onApplyFilters(); // Call the parent function to apply filters
    };

    const handleApplyFilters = () => {
        setSuburb(tempSuburb);
        setPostcode(tempPostcode);
        setState(tempState);
        handleApply();
        hideModal();
        console.log('Applying filters:', tempSuburb, tempPostcode, tempState);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <DropDownPicker
                        style={styles.dropdown}
                        items={dropdownItems}
                        open={isOpen}
                        value={tempState}
                        setOpen={() => setIsOpen(!isOpen)}
                        setValue={(value) => setTempState(value)}
                        maxHeight={300}
                        autoScroll
                        placeholder="select state"
                        placeholderStyle={{ color: "black", fontSize: 16 }}
                    />

                    <TextInput
                        label="Suburb"
                        value={tempSuburb}
                        onChangeText={text => setTempSuburb(text)}
                        style={styles.input}
                        editable={!!tempState}
                    />
                    <TextInput
                        label="Postcode"
                        value={tempPostcode}
                        onChangeText={text => setTempPostcode(text)}
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={4}
                        editable={!!tempState}
                    />
                    <Button mode="contained" onPress={handleApplyFilters} style={styles.applyButton}>
                        Apply Filters
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default SearchModal;
