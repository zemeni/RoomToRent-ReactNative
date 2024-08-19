import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MyProfile = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserProperties = async () => {
            try {
                const response = await axios.get(`http://192.168.1.108:4000/api/propertyByUsername/neupanebabu828@gmail.com`, {
                    params: {
                        type: 'room'
                    }
                });
                console.log("response in MyProfile is ", response.data);
                setProperties(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user properties:', error);
                setLoading(false);
            }
        };

        fetchUserProperties();
    }, []);

    const handlePropertyPress = (propertyId, type) => {
        navigation.navigate('EditMarkerDetails', { propertyId, type, openModal:true });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!properties.length) {
        return (
            <View style={styles.errorContainer}>
                <Text>No properties found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {properties.map((property) => (
                <TouchableOpacity
                    key={property.id}
                    style={styles.propertySnippet}
                    onPress={() => handlePropertyPress(property.id, property.type)}
                >
                    <Text style={styles.propertyInfo}>{property.type === 'room' ? 'Room' : 'Unit'}</Text>
                    <Text style={styles.propertyTitle}>{property.address}</Text>
                    <Text style={styles.propertyInfo}>${property.price} per week</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ebedf1',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertySnippet: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    propertyInfo: {
        fontSize: 16,
        marginTop: 5,
    },
});

export default MyProfile;
