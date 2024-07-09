import { Text, View, StyleSheet } from "react-native";
import { style } from "./jobs.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

const Jobs = () => {
    const inset = useSafeAreaInsets();
    console.log("job is rendered");
    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Enter Address"
                fetchDetails={true}
                onPress={(data, details = null) => {
                    console.log('Address selected:', data.description);
                    // alert(`Address selected: ${data.description}`);
                }}
                query={{
                    key: 'AIzaSyAUsXRUXnavthEq2krHHUjQU2P_KNswKbw',
                    language: 'en',
                }}
                styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    listView: styles.listView,
                }}
            />
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
