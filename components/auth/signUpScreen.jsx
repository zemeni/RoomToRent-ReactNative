import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import styles from './signUp.style';
import Toast from 'react-native-toast-message';
import Icon from "react-native-vector-icons/Ionicons";
import ModalSelector from "react-native-modal-selector";
import countriesStates from './countriesStates.json'; // Importing the JSON file

const SignUpScreen = () => {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('AUS');  // Default to Australia
    const [state, setState] = useState('NSW');      // Default to New South Wales
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();
    const route = useRoute();
    const fromScreen = route.params?.fromScreen || 'MyProfile';

    // Extract country and state data from the JSON file
    const countryOptions = countriesStates.countries.map(country => ({
        key: country.key,
        label: country.label
    }));

    const getStateOptions = (countryKey) => {
        const selectedCountry = countriesStates.countries.find(c => c.key === countryKey);
        return selectedCountry ? selectedCountry.states : [];
    };

    // Update state options based on the selected country
    useEffect(() => {
        if (country === 'AUS') {
            setState('NSW'); // Default state for Australia
        } else if (country === 'CAN') {
            setState('ON');  // Default state for Canada (Ontario)
        } else if (country === 'USA') {
            setState('CA');  // Default state for USA (California)
        }
    }, [country]);

    // Validate the form when inputs change
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
                country,
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


                <Text>Choose your Country </Text>
                <View style={styles.pickerContainer}>
                    <ModalSelector
                        data={countryOptions}
                        initValue={countryOptions.find(c => c.key === country)?.label}
                        onChange={(option) => setCountry(option.key)}
                    >
                        <View style={styles.dropdown}>
                            <Text style={styles.inputText}>
                                {countryOptions.find(c => c.key === country)?.label || 'Australia'}
                            </Text>
                            <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                        </View>
                    </ModalSelector>
                </View>

                <Text>Choose your State </Text>
                <View style={styles.pickerContainer}>
                    <ModalSelector
                        data={getStateOptions(country)}
                        initValue={getStateOptions(country).find(s => s.key === state)?.label}
                        onChange={(option) => setState(option.key)}
                    >
                        <View style={styles.dropdown}>
                            <Text style={styles.inputText}>
                                {getStateOptions(country).find(s => s.key === state)?.label || 'New South Wales'}
                            </Text>
                            <Icon name="chevron-down" size={20} color="#000" style={styles.dropdownIcon} />
                        </View>
                    </ModalSelector>
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
