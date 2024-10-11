// AccessBtn.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AccessBtn.module.scss';

const AccessBtn = ({ onClick, disabled }) => {
    const location = useLocation();
    const user = location.state?.user; // Access the user passed in state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    console.log('User Role in AccessBtn:', user?.role); // Log the user role

    if (user?.role === 'admin' || user?.role === 'staff') {
        return (
            <div className={styles.accessBtnContainer}>
                <button 
                    className={`${styles.accessBtn} ${disabled ? styles.disabled : ''}`}  
                    onClick={toggleDropdown} 
                    disabled={disabled}
                >
                    Access
                </button>
                {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                        <a href="/cards" className={styles.dropdownItem}>Edit Cards</a>
                        <a href="/modal" className={styles.dropdownItem}>Edit Modals</a>
                        <a href="/audio" className={styles.dropdownItem}>Edit Audios</a>

                        {/* Only visible for admin */}
                        {user?.role === 'admin' && (
                            <a href="/usermanage" className={styles.dropdownItem}>User Management</a>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return null; // Do not render anything if the role is not admin or staff
};

export default AccessBtn;
