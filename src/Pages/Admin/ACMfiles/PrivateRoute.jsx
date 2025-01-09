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
    const guestId = localStorage.getItem('guestId'); // Check for guestId in local storage

    if (isLoading) {
        // While jwt-decode is being loaded
        return <div>Loading...</div>;
    }

    if (!token && !guestId) {
        // If neither token nor guestId exists, redirect to login
        return <Navigate to="/" />;
    }

    try {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert('Session expired. Please log in again.');
                return <Navigate to="/" />;
            }

            const userRole = decodedToken.role;
            if (roles && !roles.includes(userRole)) {
                alert('Access denied: You do not have permission to view this page.');
                return <Navigate to="/" />;
            }
        } else if (roles && roles.includes('guest')) {
            console.log('Guest access granted');
            // If 'guest' is included in roles, ensure guestId exists
            if (!guestId) {
                alert('Access denied: Guest not authenticated.');
                return <Navigate to="/" />;
            }
        }
    } catch (error) {
        console.error('Invalid token or decoding issue', error);
        return <Navigate to="/" />;
    }


    return children;
};

export default PrivateRoute;
