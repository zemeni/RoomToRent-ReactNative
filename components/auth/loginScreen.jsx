import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { TextInput } from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Toast from "react-native-toast-message";
import {styles} from "./login.style";

const LoginScreen = () => {
    console.log("I am inside login screen");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const navigation = useNavigation();
    const { login, user } = useContext(AuthContext);


    useFocusEffect(
        React.useCallback(() => {
            setUsername('');
            setPassword('');
        }, [])
    );

    const handleLogin = async () => {
        setLoading(true);
        const success = await login(username, password);
        setLoading(false);

        if (success) {
            Toast.show({
                type: 'success',
                position: 'top',
                text1: `Login Successful`,
                text2: 'Explore RoomToRent',
                visibilityTime: 3000,
            });
            navigation.navigate('Main');
        } else {
            Alert.alert('Login failed', 'Invalid username or password');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {loading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.buttonText}>Doesn't have account? Signup</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;
