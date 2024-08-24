import { Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {useEffect} from "react";

const Jobs = () => {
    const inset = useSafeAreaInsets();
    console.log("job is rendered");

    return (
        <View style={styles.container}>
            <Text>This is a home page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    textInputContainer: {
        width: '100%',
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
    },
    listView: {
        backgroundColor: '#fff',
    },
});

export default Jobs;
