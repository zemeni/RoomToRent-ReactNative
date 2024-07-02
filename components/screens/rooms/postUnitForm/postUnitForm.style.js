import {StyleSheet} from "react-native";

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

/*    // Function to validate the form
    const validateForm = () => {
        console.log("validating form");
        const isFormValid = rooms.length > 0 && rooms.every(room => {
            return room.address !== '' && room.price > 0 && room.bathrooms > 0 && room.parkings >= 0 && room.images.length <= MAX_IMAGES;
        });
        console.log("rooms.length ", rooms.length);
        rooms.every(room => {
            console.log('room.roomType ', 'room');
            console.log('room.address', room.address, room.address !== '');
            console.log('room.price ', room.price, room.price > 0);
            console.log('room.bathrooms ', room.bathrooms, room.bathrooms > 0);
            console.log('room.parkings ', room.parkings, room.parkings >= 0);
            console.log('room.images.length ', room.images.length, room.images.length <= MAX_IMAGES);
        });
        console.log("isFormValid ", isFormValid);
        setIsSubmitDisabled(!isFormValid);
    };*/