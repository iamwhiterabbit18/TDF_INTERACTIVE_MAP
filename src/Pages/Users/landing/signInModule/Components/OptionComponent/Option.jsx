// Option.jsx
import React from "react";
import { Link , useNavigate} from "react-router-dom";
import styles from './styles/optionStyles.module.scss';

export default function Option({ handleBtnClick, handleUser }) {
    const navigate = useNavigate();

const handleGuestLogin = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/guest/logGuest', {
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
            <div className={`${styles.firstContainer} ${styles.option}`}>
                <div className={`${styles.optionContent}`}>
                    <span className={styles.txtTitle}>Login</span>
                    <button className={styles.btnSignIn} onClick={handleBtnClick}>Sign in</button>
                    <span className={styles.txtSubTitle}>OR</span>
                    <button className={styles.btnGuest} onClick={handleGuestLogin}>
                        Guest Login
                    </button>
                </div>
            </div>
        </>
    );
}
