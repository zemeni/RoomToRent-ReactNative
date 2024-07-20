import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
        </View>
    );

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                {
                    paddingTop: inset.top,
                    paddingBottom: inset.bottom,
                    paddingLeft: inset.left,
                    paddingRight: inset.right,
                },
            ]}
        >
            {user ? (
                <>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Name: {user.firstName} {user.lastName}</Text>
                        <Text style={styles.userEmail}>Email: {user.email}</Text>
                        <Text style={styles.userPhone}>Phone: {user.phoneNumber}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Rooms Posted</Text>
                        <FlatList
                            data={rooms}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Units Posted</Text>
                        <FlatList
                            data={units}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </>
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
            )}
        </ScrollView>
    );
};

export default MyProfile;
