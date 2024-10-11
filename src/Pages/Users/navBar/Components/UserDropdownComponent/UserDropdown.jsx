// For all menus, add a function where the menus will disappear when the user click outside

/* 
-- Files where UserDropdown is imported --
NavigationModule.jsx

*/

import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/userDropdownStyles.module.scss';

export default function UserDropdown({ handleClickOutside, isDropClicked }) {

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
                        initial = {{opacity: 0, translateY: 70, translateX: -37}}
                        animate = {{opacity: 1, translateY: 120}}
                        exit = {{opacity: 0, translateY: 70}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    
                    >   
                        <div id = "dropdown" className = { styles.dropdownMenu } >
                            <div className = { styles.dropMenuTitle }>
                                <span className = { styles.txtTitle }>Guest Account</span> {/* Will be changed to handle dynamic data */}
                            </div>
                            <ul className = { styles.dropMenuList }>
                                {/* If guest account is used */}
                                <li>
                                    <img className = { `${styles.icon} ${styles.signin}` } src = {icons.signIn} alt = "Signin"/>
                                    <span className = { styles.text }><Link to = "/">Sign in</Link></span>
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