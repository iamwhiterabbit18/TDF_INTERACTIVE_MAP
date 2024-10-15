import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
    const [jwtDecode, setJwtDecode] = useState(null); // To store the dynamically imported jwt_decode
    const [isLoading, setIsLoading] = useState(true); // Loading state to wait for jwt_decode to be available

    useEffect(() => {
        // Dynamically import jwt-decode
        const loadJwtDecode = async () => {
            try {
                const module = await import('jwt-decode');
                setJwtDecode(() => module.jwtDecode); // Update to use the named export jwtDecode
                setIsLoading(false); // Set loading to false after import
            } catch (error) {
                console.error('Error loading jwt-decode:', error);
                setIsLoading(false);
            }
        };

        loadJwtDecode(); // Call the function to load jwt-decode
    }, []);

    const token = localStorage.getItem('token');

    if (isLoading) {
        // While jwt-decode is being loaded
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/" />;
    }

    try {
        const decodedToken = jwtDecode(token); // Use the dynamically imported jwt_decode function
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
            // Token has expired, clear it and redirect
            localStorage.removeItem('token'); // Clear expired token
            localStorage.removeItem('user');
            return <Navigate to="/" />; // Redirect user to the login page
        }

        const userRole = decodedToken.role;
        
        if (roles && !roles.includes(userRole)) {
            // Display an alert if user does not have the required role
            alert('Access denied: You do not have permission to view this page.');
            // Redirect again to map page
            return <Navigate to="/map" />;            
        }
    } catch (error) {
        console.error('Invalid token or decoding issue', error);
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
