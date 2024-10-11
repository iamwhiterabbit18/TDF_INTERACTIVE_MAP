import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

// Add Authorization token for authenticated requests
const getToken = () => localStorage.getItem('token');

const authHeader = () => {
    const token = getToken();
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const getProtectedData = async () => {
    const response = await axios.get(`${API_URL}/protected-route`, {
        headers: authHeader()
    });
    return response.data;
};

export { register, login, getProtectedData };
