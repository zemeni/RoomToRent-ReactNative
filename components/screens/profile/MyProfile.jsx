import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {styles} from "./myprofile.style";

const MyProfile = () => {
    const inset = useSafeAreaInsets();
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Login');
    };

    // Dummy data for rooms and units
    const rooms = [
        { id: '1', name: 'Room A', location: 'Sydney, NSW' },
        { id: '2', name: 'Room B', location: 'Melbourne, VIC' },
    ];

    const units = [
        { id: '1', name: 'Unit 101', location: 'Brisbane, QLD' },
        { id: '2', name: 'Unit 202', location: 'Perth, WA' },
    ];

    // Combine sections into one list
    const combinedData = [
        { type: 'userInfo', data: user },
        { type: 'rooms', data: rooms },
        { type: 'units', data: units },
    ];

    const renderItem = ({ item }) => {
        if (item.type === 'rooms' || item.type === 'units') {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{item.type === 'rooms' ? 'Rooms Posted' : 'Units Posted'}</Text>
                    <FlatList
                        data={item.data}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemLocation}>{item.location}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                    />
                </View>
            );
        }

        return null;
    };

    return (
        <FlatList
            data={combinedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={[
                styles.container,
                {
                    paddingTop: inset.top,
                    paddingBottom: inset.bottom,
                    paddingLeft: inset.left,
                    paddingRight: inset.right,
                },
            ]}
            ListFooterComponent={
                user ? (
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("Login", { fromScreen: "Profile" })}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("SignUp", { fromScreen: "Profile" })}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        />
    );
};

export default MyProfile;
