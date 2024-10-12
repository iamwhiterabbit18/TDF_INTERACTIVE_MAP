import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Make sure you have jwt-decode installed

const API_URL = 'http://localhost:5000/api/auth';

// Register user
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

// Get the token from local storage
const getToken = () => localStorage.getItem('token');

// Check if token is expired
const isTokenExpired = () => {
    const token = getToken();
    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decoded.exp < currentTime) {
            // Token is expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Your session has expired. Please log in again.');
            return true;
        }
    }
    return false;
};

// Attach the Authorization header
const authHeader = () => {
    const token = getToken();
    if (token && !isTokenExpired()) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// Get protected data with token validation
const getProtectedData = async () => {
    if (isTokenExpired()) {
        throw new Error('Token expired');
    }

    const response = await axios.get(`${API_URL}/protected-route`, {
        headers: authHeader()
    });
    return response.data;
};

export { register, login, getProtectedData };
