// AccessBtn.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AccessBtn.module.scss';
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import NewsEventImage from '/src/Pages/Admin/edit/EditNewsEvent';


const AccessBtn = ({ onClick, disabled }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: authUser, logout } = useAuth(); // Access logout from context

    //const user = location.state?.user; // Access the user passed in state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // Toggle modal visibility
    };

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

                        {/* Trigger Image Upload Modal */}
                        <button 
                            className={styles.dropdownItem} 
                            onClick={toggleModal} // Open modal on click
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
                        >Edit News&Event
                        </button>
                        
                        {/* Logout Button */}
                        <button 
                            className={styles.dropdownItem} 
                            onClick={handleLogout} 
                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
                        >Logout
                        </button>
                    </div>
                )}
                {/* Image Upload Modal */}
                <NewsEventImage isOpen={isModalOpen} onClose={toggleModal} /> {/* Trigger modal here */}
            </div>
        );
    }

    return null; // Do not render anything if the role is not admin or staff
};

export default AccessBtn;
