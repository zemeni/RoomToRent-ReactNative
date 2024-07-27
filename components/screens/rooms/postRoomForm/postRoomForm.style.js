import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    roomSelection: {
        marginBottom: 20,
    },
    roomContainer: {
        marginBottom: 20,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        position: 'relative',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    inputContainer1: {
        flex:1,
        marginRight: 10,
        marginTop: 12
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 12,
        height: 40, // Adjust the height to match the input field
        justifyContent: 'center', // Center the picker vertically
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10
    },
    datePickerInput: {
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 80, // Increased height for multiline description input
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    imagePreview: {
        marginRight: 10,
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    picker: {
        height: 40, // Adjust the height to match the input field
        paddingHorizontal: 10, // Reduce padding to match the input field
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        borderRadius: 50, // This makes the button round
        backgroundColor: '#5a87ca', // Background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    uploadImage: {
      marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#d3d3d3', // Light gray color for disabled state
    },
    noRoomsMessage: {
        marginTop: 10,
        fontStyle: 'italic',
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
