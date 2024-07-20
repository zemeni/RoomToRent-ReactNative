import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    userInfo: {
        padding: 20,
        backgroundColor: '#ffffff',
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 16,
        marginVertical: 5,
    },
    userPhone: {
        fontSize: 16,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    list: {
        maxHeight: 200, // Adjust height as needed
    },
    itemContainer: {
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemLocation: {
        fontSize: 14,
        color: '#555',
    },
    button: {
        backgroundColor: '#6014b1',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        alignItems: 'center',
        width: '60%', // Adjust width as needed
        alignSelf: 'center',
    },
    buttonText: {
        color: '#c14747',
        fontSize: 16,
    },
});
