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
        fetchUsers();
    }, []);

    const login = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
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
