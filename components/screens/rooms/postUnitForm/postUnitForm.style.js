import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        // backgroundColor: '#f4f4f4',
    },
    unitSelection: {
        marginBottom: 20,
    },
    unitContainer: {
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
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
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
