import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";
import { Ionicons } from '@expo/vector-icons';

const MyProperty = () => {
    console.log("My property page is mounted");
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const fetchUserProperties = async () => {
        try {
            console.log("user details in profile page", user);
            setLoading(true);
            const { email } = user.userProfile;
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
            setRefreshing(false);
        }
    };

    console.log("I am inside my property page");

    useEffect(() => {
        console.log("component mounted, fetching properties");
        fetchUserProperties();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUserProperties();
    };


    const handlePropertyPress = (item) => {
        console.log("item type ", item.type);

        switch (item.type) {
            case 'room':
                navigation.navigate('EditRoomPropertyDetails', {
                    propertyId: item.id,
                    type: item.type,
                });
                break;

            case 'unit':
                navigation.navigate('EditUnitPropertyDetails', {
                    propertyId: item.id,
                    type: item.type,
                });
                break;

            default:
                throw new Error('Property type not found');
        }
    };

    const renderPropertyItem = ({ item }) => (
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                        <Ionicons name="refresh" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.errorContainer}>
                    <Text>No properties found.</Text>
                </View>
                <View style={styles.footerContainer}>
                    <Button
                        title="Logout"
                        onPress={logout}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                    <Ionicons name="refresh" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={properties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
            <View style={styles.footerContainer}>
                <Button
                    title="Logout"
                    onPress={logout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ebedf1',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#235e9e',
        padding: 10,
        borderRadius: 10,
    },
    refreshButtonText: {
        fontSize: 16,
        marginRight: 10,
        color: '#fff'
    },
    footerContainer: {
        marginTop: 50,
        paddingHorizontal: 10,
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
