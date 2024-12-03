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
import { motion, AnimatePresence } from 'framer-motion'

// import axios from 'axios'


export default function SignIn ({ handleBtnClick, isBtnClicked, handleUser }) {
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

            localStorage.setItem('user', JSON.stringify(response));
            localStorage.setItem('token', response.token);
            setUser(response);

            // Now you can navigate based on the user role
            if (response.role === 'admin' || response.role === 'staff') {
                console.log(response.role ,'Logged In!')
                navigate('/map', { state: { user: response } }); // Pass user object for admin and staff
            } else if (response.role === 'guest') {
                navigate('/map'); // Guest just navigates without passing user
            }
        } catch (error) {
            setError('Failed to login');
        }
    };

    return (
        <AnimatePresence>
            {isBtnClicked && (
                <motion.div 
                    className = { `${ styles.signInContent }` }
                    initial = {{opacity: 0}}
                    animate = {{opacity: 1}}
                    exit = {{opacity: 0, transition: {delay: 0}}}
                    transition = {{duration: 0.3, delay: 0.2, ease: "easeInOut"}}
                >
                    <div className = { styles.return } onClick = { handleBtnClick }>
                        <img src = { icons.arrow } alt = "Close" />
                    </div>

                    <span className = { styles.txtTitle }>Sign in</span>

                    <form className = { styles.form } onSubmit = { handleSubmit } >
                        <label htmlFor = "email">Email</label>
                        <input 
                            autoComplete = "off"
                            name = "email"
                            type = "email"
                            required
                            onChange = {(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor = "password">Password</label>
                        <input 
                            autoComplete = "off"
                            name = "password"
                            type = "password" 
                            required
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                        {/* Change button names into general names */}
                        <button className = { `${styles.button } ${styles.submitBtn }` } type = "submit">
                            Sign in
                        </button>
                    </form>
                </motion.div>   
            )}
        </AnimatePresence>
    )
}