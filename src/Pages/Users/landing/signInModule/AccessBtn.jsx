// AccessBtn.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AccessBtn.module.scss';
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';


const AccessBtn = ({ onClick, disabled }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: authUser, logout } = useAuth(); // Access logout from context

    //const user = location.state?.user; // Access the user passed in state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout(); // Call the logout function from context
        console.log(user.role,'logout')
        //navigate('/'); // Redirect to home or login page after logout
    };

    // Combine user from Auth context and location state
    const user = location.state?.user || authUser;
    

    if (user?.role === 'admin' || user?.role === 'staff') {
        //console.log(user.role,'logged in');
        return (
            <div className={styles.accessBtnContainer}>
                <button 
                    className={`${styles.accessBtn} ${disabled ? styles.disabled : ''}`}  
                    onClick={toggleDropdown} 
                    disabled={disabled}
                >
                    Menu
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
                        
                        {/* Logout Button */}
                        <button 
                            className={styles.dropdownItem} 
                            onClick={handleLogout} 
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
                        >Logout
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return null; // Do not render anything if the role is not admin or staff
};

export default AccessBtn;
