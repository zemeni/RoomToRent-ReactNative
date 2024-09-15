import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Button} from 'react-native';
import axios from 'axios';
import {useNavigation} from "@react-navigation/native";
import {AuthContext} from "../../auth/AuthContext";

const MyProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const {user, logout} = useContext(AuthContext);
    const navigation = useNavigation();

    const fetchUserProperties = async () => {
        try {
            console.log("user details in profile page", user);
            setLoading(true);
            const {email} = user.userProfile;
            const response = await axios.get(`http://192.168.1.108:4000/api/propertyByUsername/${email}`, {
                params: {
                    type: 'room'
                }
            });
            console.log("response in MyProperty is ", response.data);
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching user properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProperties();
    }, []);

    const deleteProperty = async (id, type) => {
        console.log("Deleting property of type ", type);
        try {
            const response = await fetch(`http://192.168.1.108:4000/api/property/${id}?type=${encodeURIComponent(type)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + user.token,  // Ensure user is authenticated
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            fetchUserProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const handlePropertyPress = (item) => {
        console.log("item type ", item.type);

        const deletePropertyHandler = () => deleteProperty(item.id, item.type);

        switch (item.type) {
            case 'room':
                navigation.navigate('EditRoomPropertyDetails', {
                    propertyId: item.id,
                    type: item.type,
                    deleteProperty: deletePropertyHandler,
                    // onClose: () => navigation.goBack() // Pass the onClose function if needed
                });
                break;

            case 'unit':
                navigation.navigate('EditUnitPropertyDetails', {
                    propertyId: item.id,
                    type: item.type,
                    deleteProperty: deletePropertyHandler,
                    // onClose: () => navigation.goBack() // Pass the onClose function if needed
                });
                break;

            default:
                throw new Error('Property type not found');
        }
    };


    const renderPropertyItem = ({item}) => (
        <TouchableOpacity
            style={styles.propertySnippet}
            onPress={() => handlePropertyPress(item)}
        >
            <Text style={styles.propertyInfo}>{item.type === 'room' ? 'Room' : 'Unit'}</Text>
            <Text style={styles.propertyTitle}>{item.address}</Text>
            <Text style={styles.propertyInfo}>${item.price} per week</Text>
        </TouchableOpacity>
    );

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

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <Button
                        title="Logout"
                        onPress={handleLogout}
                    /></View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ebedf1',
    },
    footerContainer: {
        marginTop: 50, // Adjust the margin as needed
        paddingHorizontal: 10, // Optional: Add horizontal padding if needed
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

export default MyProperty;
