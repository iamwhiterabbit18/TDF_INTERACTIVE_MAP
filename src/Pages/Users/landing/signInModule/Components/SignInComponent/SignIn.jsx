/*
-- Files where SignIn is imported --
Option.jsx

*/
import { Link , useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { login } from '/src/Pages/Admin/ACMfiles/authService';
import { useUser } from '/src/Pages/Admin/ACMfiles/UserContext';
import styles from './styles/signInStyles.module.scss';
import icons from '../../../../../../assets/for_landingPage/Icons.jsx';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode

import { useEffect } from "react";

// import axios from 'axios'


export default function SignIn ({ handleBtnClick, handleUser }) {
    const { login: setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { email, password };
            const response = await login(userData);

            const decodedUser = jwtDecode(response.token); // Decode the token here
            localStorage.setItem('token', response.token);
            setUser(decodedUser); // Update user context with decoded user
    
            handleUser(decodedUser.role, decodedUser.role); // Set the user role
    
            if (decodedUser.role === 'admin' || decodedUser.role === 'staff') {
                navigate('/map', { state: { user: decodedUser } }); // Pass decoded user object for admin and staff
            } else if (decodedUser.role === 'guest') {
                navigate('/map'); // Guest just navigates without passing user
            }
        } catch (error) {
            setError('Failed to login');
        }
    };
    

    return (
        <div className = {`${ styles.firstContainer } ${ styles.signIn }`}> {/* Login form */}  
            <div className = { `${ styles.signInContent }`}>
                <div className = { styles.return } onClick = { handleBtnClick}>
                    <img src = { icons.arrow } alt = "Close" />
                </div>
                <span className = { styles.txtTitle }>Sign in</span>
                {error && <p className={styles.error}>{error}</p>} {/* Display error if any */}

                <form className = { styles.form }  onSubmit = {handleSubmit}  >
                    <label htmlFor = "email">Email</label>
                    <input
                        autoComplete="off"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor = "password">Password</label>
                    <input
                        autoComplete="off"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {/* Change button names into general names */}
                    <button className = { styles.btnGuest } type = "submit">
                                Sign in
                       {/*  <Link to = "/map">Sign in</Link>*/}
                    </button>
                </form>
            </div>    
        </div>
    )
}