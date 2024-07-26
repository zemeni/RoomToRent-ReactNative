import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Toast from "react-native-toast-message";
import {styles} from "./login.style";

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);
    const navigation = useNavigation();
    const { login, user } = useContext(AuthContext);

    useEffect(() => {
        validateForm();
    }, [username, password]);

    const validateForm = () => {
        const newErrors = {};

        if (!username) {
            newErrors.username = 'Please enter a valid email';
        }

        if (!password.length < 2) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setIsValid(Object.keys(newErrors).length === 0);
    };

    const handleLogin = async () => {
        const success = await login(username, password);
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
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={!isValid}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.buttonText}>Doesn't have account? Signup</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;
