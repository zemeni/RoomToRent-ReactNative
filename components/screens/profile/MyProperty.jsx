import React, {useState, useContext, useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import axios from 'axios';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";

const MyProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const fetchUserProperties = async () => {
        try {
            setLoading(true);
            const { email } = user.userProfile;
            const response = await axios.get(`http://192.168.1.108:4000/api/propertyByUsername/${email}`, {
                params: {
                    type: 'room'
                }
            });
            setProperties(response.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserProperties();
        }, [])
    );

    const handleLogout = () => {
        logout();
    }


    const handlePropertyPress = (item) => {
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

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.footerContainer}>
                <Text>{user.userProfile.firstname} {user.userProfile.lastname}</Text>
                <Button
                    title="Logout"
                    onPress={handleLogout}
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
