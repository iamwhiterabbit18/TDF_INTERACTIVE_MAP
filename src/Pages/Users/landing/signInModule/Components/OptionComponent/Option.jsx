// Option.jsx
import React, { useState } from 'react';
import { Link , useNavigate} from "react-router-dom";
import styles from './styles/optionStyles.module.scss';
import { motion, AnimatePresence } from 'framer-motion'
import icons from '../../../../../../assets/for_landingPage/Icons';

export default function Option({ handleBtnClick, isBtnClicked, handleUser }) {
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

    const handleGuestLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/guest/logGuest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const data = await response.json();
                // Store guestId in localStorage
                localStorage.setItem('guestId', data.guestId); 
                handleUser('guest', data.guestId); // Pass the guestId to handleUser function
                navigate('/map');
            } else {
                console.error('Failed to log guest login');
            }
        } catch (error) {
            console.error('Error logging guest login:', error);
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
                            <select>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            <label>Role</label>
                            <select>
                                <option value="student">Student</option>
                                <option value="farmer">Farmer</option>
                                <option value="governmentAssoc">Government Associate</option>
                                <option value="Others">Others</option>
                            </select>
                        </form>

                        <button 
                            className = { `${styles.button} ${styles.btnGuest}`}
                            onClick = { () => handleGuestLogin('Guest') }
                        >
                            <Link to ={ "/map"}>Guest Login</Link>
                        </button> 
                        
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
