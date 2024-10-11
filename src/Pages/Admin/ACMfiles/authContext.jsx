// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, []);

    const logout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // No token to log out with
    
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the header
                },
            });

            // Clear the token and user data from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Reset user state
            setUser(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
