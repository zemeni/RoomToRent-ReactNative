import {StyleSheet, Dimensions} from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topRight: {
        position: 'absolute',
        bottom: 100,
        right: 10,
        zIndex: 1,
    },
    mapTypeButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    bottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 10,
    },
    resetButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
    },
    postButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        backgroundColor: '#ff5722',
        padding: 15,
        borderRadius: 10,
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    mapTypeText: {
        fontSize: 18,
        paddingVertical: 10,
        color: "#1c3fcc"
    },
    mapTypeCancel: {
        fontSize: 18,
        paddingVertical: 10,
        color: 'red',
    },
    mapTypeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '100%',
        justifyContent: 'flex-start',
    },
});
