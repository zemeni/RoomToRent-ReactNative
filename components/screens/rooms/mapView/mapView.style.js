import {StyleSheet, Dimensions} from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    topRight: {
        position: 'absolute',
        top: 20, // Adjust as needed to position from the top
        right: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    bottomRight: {
        position: 'absolute',
        bottom: 80, // Adjust as needed to position from the bottom
        right: 10,
    },
    mapTypeButton: {
        padding: 10,
    },
    resetButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    postButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: '#072c7e',
        padding: 10,
        borderRadius: 5,
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
    },
    sliderContainer: {
        display: 'flex',
        flexDirection: "row",
        width: '100%',
        height: 50,
        justifyContent: 'space-around',
        backgroundColor: "#adc3c3",
        bottom: 15
    },
    slider: {
        width: width * 0.7,
    },
    searchButton: {
        backgroundColor: '#3168d6',
        borderRadius: 10,
        padding: 5,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});