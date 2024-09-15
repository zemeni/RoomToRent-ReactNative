import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 10,
        position: 'absolute',
        top: 20,
        left: 10,
        zIndex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginVertical: 10,
        flex: 1,
        marginRight: 5
    },
    inputContainer1: {
        marginVertical: 10,
        flex: 1,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 11,
        fontSize: 16,
    },
    inputError: {
        borderBottomColor: 'red',
    },
    pickerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    inputText: {
        fontSize: 14,
        color: '#000',
    },
    dropdownIcon: {
        marginLeft: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    },
    info: {
        fontSize: 16,
        marginVertical: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePickerButton: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 10,
    },
    datePickerText: {
        fontSize: 16,
    },
    button: {
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    updateButton: {
        backgroundColor: 'green',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
