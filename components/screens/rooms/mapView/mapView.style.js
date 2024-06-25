import {StyleSheet} from "react-native";

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
});