import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const storedUsers = await AsyncStorage.getItem('users');
            setUsers(storedUsers ? JSON.parse(storedUsers) : []);
        };

        const fetchUserSession = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            const loginTime = await AsyncStorage.getItem('loginTime');
            if (storedUser && loginTime) {
                const currentTime = new Date().getTime();
                const loginTimeDate = new Date(parseInt(loginTime)).getTime();
                const oneDay = 24 * 60 * 60 * 1000;

                if (currentTime - loginTimeDate < oneDay) {
                    setUser(JSON.parse(storedUser));
                } else {
                    await AsyncStorage.removeItem('user');
                    await AsyncStorage.removeItem('loginTime');
                }
            }
        };

        fetchUsers();
        fetchUserSession();
    }, []);

    const login = async (email, password) => {
        console.log("Attempting login with email:", email);

        try {
            const response = await fetch('http://192.168.1.108:4000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Login failed:", data.message || response.statusText);
                return false;
            }

            console.log("Login successful, user data:", data);
            setUser(data);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };


    const logout = async () => {
        setUser(null);
    };

    const signUp = async (newUser) => {
        console.log("Attempting signup for:", newUser);

        try {
            const response = await fetch('http://192.168.1.108:4000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Signup failed:", data.message || response.statusText);
                return false;
            }

            console.log("Signup successful, user data:", data);
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};
