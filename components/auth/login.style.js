import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 12,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'left',
        width: '100%',
    },
    loadingIndicator: {
        position: 'absolute',
        top: 50, // Adjust the position as needed
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1, // Make sure it's on top
    },
});

export default styles;
