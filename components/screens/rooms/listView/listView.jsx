import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ListView = ({markers}) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    console.log("markers in list view ", markers.length);

    useEffect(() => {
        if (markers.length > 0) {
            const mappedRooms = markers.map(marker => ({
                id: marker.id,
                price: marker.price,
                address: marker.address,
                description: marker.description,
                type: marker.type
            }));
            setRooms(mappedRooms);
        }else {
            setRooms([]);
        }
        setLoading(false);
    }, []);


    const handlePress = (item) => {
        navigation.navigate('MarkerDetailsPage', {propertyId: item.id, type: item.type})
    }

    const renderItem = ({item, index}) => (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={[styles.itemText, { fontWeight: 'bold' }]}>Price: ${item.price}</Text>
                <Text style={styles.itemText}>Address: {item.address}</Text>
                <Text style={[styles.itemText, { fontWeight: 'bold' }]}>{item.type}</Text>
            </View>
            <Text style={styles.indexText}>{index + 1}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    itemDetails: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ListView;
