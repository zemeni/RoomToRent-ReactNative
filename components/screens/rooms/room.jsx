import React, {useState, useEffect, useContext, useMemo, useCallback} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import MapViewTab from './mapView/mapView';
import ListView from './listView/listView';
import { styles } from './room.style';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';

const TopTab = createMaterialTopTabNavigator();

const stateCoordinates = {
    NSW: { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    VIC: { latitude: -37.8136, longitude: 144.9631 }, // Melbourne
    QLD: { latitude: -27.4698, longitude: 153.0251 }, // Brisbane
    SA: { latitude: -34.9285, longitude: 138.6007 },  // Adelaide
    WA: { latitude: -31.9505, longitude: 115.8605 },  // Perth
    TAS: { latitude: -42.8821, longitude: 147.3272 }, // Hobart
    NT: { latitude: -12.4634, longitude: 130.8456 },  // Darwin
    ACT: { latitude: -35.2809, longitude: 149.1300 }  // Canberra
};

const Room = () => {
    const {user} = useContext(AuthContext);
    const [state, setState] = useState(user?.userProfile?.state || 'NSW');
    const [markers, setMarkers] = useState([]);
    const [mapLocation, setMapLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    console.log("why I am inside the room page?");

    useEffect(() => {
        const getUserLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission to access location was denied. Please enable it in settings to continue.',
                    [{ text: 'OK' }]
                );
                return;
            }

            let { coords } = await Location.getCurrentPositionAsync({});
            setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
        };

        const fetchRoomData = async (selectedState) => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/properties?state=${selectedState}`); // Replace with your IP address
                console.log("rooms response is ", response.data);

                const fetchedMarkers = response.data.map((room, index) => ({
                    id: room.id.toString(),
                    coordinate: {
                        latitude: room.latitude,
                        longitude: room.longitude
                    },
                    price: room.price,
                    type: room.type
                }));

                setMarkers(fetchedMarkers);
            } catch (error) {
                console.error("Error fetching rooms data: ", error.message);
            }
        };
        fetchRoomData(state);
        getUserLocation();
    }, [state]);

    useEffect(() => {
        console.log("you've chosen ", state);
        setMapLocation(stateCoordinates[state]);
    }, [state]);


    console.log("marker in room page ", markers);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={state}
                    style={styles.picker}
                    onValueChange={(itemValue) => setState(itemValue)}
                >
                    <Picker.Item label="New South Wales" value="NSW" />
                    <Picker.Item label="Victoria" value="VIC" />
                    <Picker.Item label="Queensland" value="QLD" />
                    <Picker.Item label="South Australia" value="SA" />
                    <Picker.Item label="Western Australia" value="WA" />
                    <Picker.Item label="Tasmania" value="TAS" />
                    <Picker.Item label="Northern Territory" value="NT" />
                    <Picker.Item label="Australian Capital Territory" value="ACT" />
                </Picker>
            </View>

            <TopTab.Navigator>
                <TopTab.Screen name="Map" >
                    {props => <MapViewTab {...props} markers={markers} mapLocation={mapLocation}  userLocation={userLocation}/>}
                </TopTab.Screen>
                <TopTab.Screen name="List">
                    {props => <ListView {...props} markers={markers}/>}
                </TopTab.Screen>
            </TopTab.Navigator>
        </SafeAreaView>
    );
};

export default Room;
