import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import { Picker } from '@react-native-picker/picker';
import styles from './signUp.style';

const SignUpScreen = () => {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [state, setState] = useState('NSW');
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const fromScreen = route.params?.fromScreen || 'MyProfile';

    useEffect(() => {
        validateForm();
    }, [email, password, confirmPassword, firstName, lastName, phoneNumber]);

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

        if (!firstName) {
            newErrors.firstName = 'Please enter your first name';
        }

        if (!lastName) {
            newErrors.lastName = 'Please enter your last name';
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    };

    const handleSignUp = async () => {
        const newUser = {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            state,
        };

        await signUp(newUser);
        navigation.navigate('Login', { fromScreen });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
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
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
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
