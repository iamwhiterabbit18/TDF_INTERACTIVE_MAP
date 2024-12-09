// Option.jsx
import React, { useState } from 'react';
import { Link , useNavigate} from "react-router-dom";
import styles from './styles/optionStyles.module.scss';
import { motion, AnimatePresence } from 'framer-motion'
import icons from '../../../../../../assets/for_landingPage/Icons';

import UseToast from '../../../../../Admin/utility/AlertComponent/UseToast';

export default function Option({ handleBtnClick, isBtnClicked, handleUser }) {
    // toast alert pop up
    const mountToast = UseToast();

    const navigate = useNavigate();
    const [isGuest, setIsGuest] = useState(false);
    const [optionUnmountDelay, setOptionUnmountDelay] = useState(false);
    const [categoryUnmountDelay, setCategoryUnmountDelay] = useState(true);

    
    function toggleGuest() {
        if (!isGuest) {
            setIsGuest(!isGuest);

            setTimeout(() => {
                setOptionUnmountDelay(!optionUnmountDelay); 
                setCategoryUnmountDelay(!categoryUnmountDelay); 
            }, 299.85);
        } else {
            setIsGuest(!isGuest);

            setTimeout(() => {
                setOptionUnmountDelay(!optionUnmountDelay); 
                setCategoryUnmountDelay(!categoryUnmountDelay); 
            }, 299.85);
        }
    }

    const [selectedRole, setSelectedRole] = useState(''); // New state for role
    const [sexAtBirth, setSexAtBirth] = useState(''); // state for assigned sex
    const [customRole, setCustomRole] = useState(''); // State for custom role input

    // Function to handle sex selection
    const handleSexChange = (e) => {
        setSexAtBirth(e.target.value);
    };
    
    const handleGuestLogin = async () => {
        // Validate inputs
        if (!selectedRole) {
            mountToast("Please select a role!", "error");
            return;
        }
        if (selectedRole === 'Others' && !customRole.trim()) {
            mountToast("Please specify your role if you selected 'Others'!", "error");
            return;
        }
        if (!sexAtBirth) {
            mountToast("Please choose Assigned Sex at Birth!", "error");
            return;
        }
    
        try {
            console.log("Sex at Birth (frontend):", sexAtBirth);
            console.log("Role (frontend):", selectedRole);
            console.log("Custom Role (frontend):", customRole); // Debugging: Log customRole if applicable
    
            const requestBody = {
                sexAtBirth,
                role: selectedRole,
            };
    
            // Include customRole if the selected role is "Others"
            if (selectedRole === 'Others') {
                requestBody.customRole = customRole;
            }
    
            const response = await fetch('http://localhost:5000/api/guest/logGuest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('guestId', data.guestId);
                handleUser('guest', data.guestId); // Pass the guestId to handleUser function
                navigate('/map');
            } else {
                console.error('Failed to log guest login');
                mountToast("An error occurred while logging in. Please try again.", "error");
            }
        } catch (error) {
            console.error('Error logging guest login:', error);
            mountToast("An error occurred while logging in. Please check your network and try again.", "error");
        }
    };
    

    return (
        <>
            <AnimatePresence>
                {(!isBtnClicked && !isGuest && categoryUnmountDelay) && (
                    <motion.div 
                        className = { styles.optionContent } 
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0, transition: {delay: 0}}}
                        transition = {{duration: 0.3, delay: 0.2, ease: "easeInOut"}}
                    >
                        <span className = { styles.txtTitle }>Login</span>
                        <button className = { `${styles.button} ${styles.btnSignIn}` } onClick = { handleBtnClick }>Sign in</button>
                        <span className = { styles.txtSubTitle }>OR</span>
                        <button 
                            className = { `${styles.button} ${styles.btnGuest}`}
                            // onClick = { () => handleGuestLogin('Guest') }
                            onClick = { toggleGuest }
                        >
                            Guest Login
                        </button> 
                    </motion.div>  
                )}
            </AnimatePresence>
            <AnimatePresence>
                {(isGuest && optionUnmountDelay) && (
                    <motion.div
                        className = { styles.guestCategory }
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0, transition: {delay: 0}}}
                        transition = {{duration: 0.3, delay: 0.2, ease: "easeInOut"}}
                    >
                        <div className = { styles.return } onClick = { toggleGuest }>
                            <img src = { icons.arrow } alt = "Close" />
                        </div>
                        <form>
                            <label>Assigned Sex at Birth</label>
                            <select value={sexAtBirth} onChange={handleSexChange}>
                                <option value="">--Select--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <label>Role</label>
                            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>   
                                <option value="">--Select--</option>                            
                                <option value="Student">Student</option>
                                <option value="Farmer">Farmer</option>
                                <option value="GovernmentAssoc">Government Associate</option>
                                <option value="Others">Others</option>
                            </select>

                              {/* Conditional Input for Custom Role */}
                              {selectedRole === 'Others' && (
                                <div className = {styles.userInput}>
                                    <label>Specify Your Role</label>
                                    <input
                                        type="text"
                                        value={customRole}
                                        onChange={(e) => setCustomRole(e.target.value)}
                                        placeholder="Enter your role"
                                    />
                                </div>
                            )}
                        </form>

                        <button 
                            className = { `${styles.button} ${styles.btnGuest}`}
                            onClick = { () => handleGuestLogin('Guest') }>
                            Guest Login
                        </button> 
                        
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
