import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 10,
    },
    pickerContainer: {
        marginTop: Platform.OS === 'ios' ? 0 : 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    pickerText: {
        fontSize: 16,
        color: '#000',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownIcon: {
        marginLeft: 10,
    },
    cardsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
    },
    card: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'gray',  // Border to simulate the card-like look
    },
    cardBody: {
        padding: 5,
    },
    cardText: {
        fontSize: 14,
        fontWeight: "bold",
        color: '#333',
        lineHeight: 20,  // For better readability
        textAlign: 'justify',  // Justify the text for a cleaner look
    },
    videoContainer: {
        height: 200,  // Fixed height for the video container
        borderColor: 'gray',
    },
    webview: {
        flex: 1,  // Ensure the video takes up the full container space
    },
});
