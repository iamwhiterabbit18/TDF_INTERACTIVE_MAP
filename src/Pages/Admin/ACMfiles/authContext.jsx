// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // jwtDecode doesn't need curly braces
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);

                // Check if the token is expired
                const currentTime = Date.now() / 1000; // Current time in seconds
     // Check if the token is expired for admin and staff only
    if ((decodedUser.role === 'admin' || decodedUser.role === 'staff') && decodedUser.exp < currentTime) {
                //if (decodedUser.exp < currentTime) {

                    // Token has expired
                    alert('Your session has expired, please log in again.');
                    logout();
                } else {
                    setUser(decodedUser); // Token is still valid
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                logout(); // If decoding fails, logout
            }
        }
    }, []);

    const logout = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) return; // No token to log out with
    
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds
    
            // If the token is expired, clear storage and handle logout locally
            if (decodedToken.exp < currentTime) {
                console.warn("Token expired. Logging out locally.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                navigate('/');
                return; // Exit function without making API call
            }
    
            // If the token is valid, make the logout API call
            const response = await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the header
                },
            });
            
            
    
            console.log("Logout response:", response.data); // Log the response to see if it's successful
    
            // Clear the token and user data from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
    
            // Reset user state
            setUser(null);
    
            // Redirect the user to the login page
            navigate('/');
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
