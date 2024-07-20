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
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setUser(user);
            console.log("successful login");

            // await AsyncStorage.setItem('user', JSON.stringify(user));
            // await AsyncStorage.setItem('loginTime', new Date().getTime().toString());
            return true;
        }
        return false;
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('loginTime');
    };

    const signUp = async (newUser) => {
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};
