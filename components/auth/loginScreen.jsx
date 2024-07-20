// LoginScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Toast from "react-native-toast-message";

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        const success = await login(username, password);
        if (success) {
            Toast.show({
                type: 'success',
                position: 'bottom',
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
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleLogin} />
                <View style={styles.buttonSpacer} />
                <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonSpacer: {
        width: 10,
    },
});

export default LoginScreen;
