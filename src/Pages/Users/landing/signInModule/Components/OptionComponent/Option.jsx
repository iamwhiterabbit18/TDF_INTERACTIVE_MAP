// Option.jsx
import React from "react";
import { Link , useNavigate} from "react-router-dom";
import styles from './styles/optionStyles.module.scss';
import { motion, AnimatePresence } from 'framer-motion'

export default function Option({ handleBtnClick, isBtnClicked, handleUser }) {
    const navigate = useNavigate();

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
                {!isBtnClicked && (
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
                        <button className = { `${styles.button} ${styles.btnGuest}`}
                            onClick = { () => handleGuestLogin('Guest') }>
                            <Link to ={ "/map"}>Guest Login</Link>
                        </button> 
                    </motion.div>  
                )}
            </AnimatePresence>
        </>
    );
}
