import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import { Picker } from '@react-native-picker/picker';
import styles from './signUp.style';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState('NSW');
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const fromScreen = route.params?.fromScreen || 'MyProfile';

    useEffect(() => {
        validateForm();
    }, [email, password, confirmPassword, firstname, lastname, phone]);

    const validateForm = () => {
        const newErrors = {};

        if (!email.includes('@')) {
            newErrors.email = 'Please enter a valid email';
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!firstname) {
            newErrors.firstname = 'Please enter your first name';
        }

        if (!lastname) {
            newErrors.lastname = 'Please enter your last name';
        }

        if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    };

    const handleSignUp = async () => {
        try {
            const newUser = {
                email,
                password,
                firstname,
                lastname,
                phone,
                state,
            };

            await signUp(newUser);

            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Sign Up Successful',
                text2: 'You can now log in with your credentials.',
                visibilityTime: 3000,
            });

            navigation.navigate('Login', { fromScreen });
        } catch (error) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Sign Up Failed',
                text2: 'An error occurred during sign up. Please try again.',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstname}
                    onChangeText={setFirstName}
                />
                {errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastname}
                    onChangeText={setLastName}
                />
                {errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={state}
                        style={styles.picker}
                        onValueChange={(itemValue) => setState(itemValue)}
                    >
                        <Picker.Item label="New South Wales" value="NSW" />
                        <Picker.Item label="Victoria" value="VIC" />
                        <Picker.Item label="Queensland" value="QLD" />
                        <Picker.Item label="South Australia" value="SA" />
                        <Picker.Item label="Western Australia" value="WA" />
                    </Picker>
                </View>
                <TouchableOpacity
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={handleSignUp}
                    disabled={!isValid}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SignUpScreen;
