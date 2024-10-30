// For all menus, add a function where the menus will disappear when the user click outside

/* 
-- Files where UserDropdown is imported --
NavigationModule.jsx

*/

import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, } from 'react-router-dom';
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';

import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/userDropdownStyles.module.scss';

export default function UserDropdown({ handleClickOutside, isDropClicked }) {

    const location = useLocation();
    const { user: authUser, logout } = useAuth();
    const user = location.state?.user || authUser;

    const handleLogout = () => {
        logout(); // Call the logout function from context
        console.log(user.role,'logout')
        //navigate('/'); // Redirect to home or login page after logout
    };

    // closes the dropdown if the user clicked outside (anywhere in the screen except the dropdown)
    useEffect(function() {
        if (isDropClicked) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropClicked]);
    
    return (
        <>
            <AnimatePresence>
                {isDropClicked && (
                    <motion.div
                        initial = {window.innerWidth > 992 ? {opacity: 0, translateY: 70, translateX: -37} : {opacity: 0, translateY: 70, translateX: -10}}
                        animate = {window.innerWidth > 992 ? {opacity: 1, translateY: 120} : {opacity: 1, translateY: 100}}
                        exit = {{opacity: 0, translateY: 70}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    
                    >   
                        <div id = "dropdown" className = { styles.dropdownMenu } >
                            <div className = { styles.dropMenuTitle }>
                                <span className = { styles.txtTitle }>
                                    {user?.role === "admin" 
                                        ? <>Admin Account</> // replace with username
                                        : user?.role === "staff"
                                        ? <>Staff Account</>
                                        : <>Guest Account</>
                                    }
                                </span> {/* Will be changed to handle dynamic data */}
                            </div>
                            <ul className = { styles.dropMenuList }>
                                {/* If guest account is used */}
                                <li
                                    onClick = { (user?.role === "admin" || user?.role === "staff") ? handleLogout : null }
                                >
                                    <img className = { `${styles.icon} ${styles.signin}` } src = {icons.signIn} alt = "Signin"/>
                                    <span className = { styles.text }>
                                        {(user?.role === "admin" || user?.role === "staff")
                                            ? <>Log Out</>
                                            : <Link to = "/">Sign in</Link>
                                        }
                                    </span>
                                </li>

                                {/* else, if existing account is logged in */}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}