
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';


import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/navListStyles.module.scss';

export default function NavList ({ 
    handleClickOutside, 
    isHamClicked, 
    isNavListClosed, 
    handleModalClick, 
    captureNavListClick, 
    toggleEditContent
}) {

    const location = useLocation();
    const { user: authUser, logout } = useAuth();
    const user = location.state?.user || authUser;

    const navigate = useNavigate();

    // closes the dropdown if the user clicked outside (anywhere in the screen except the dropdown)
    useEffect(function() {
        if (!isNavListClosed) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNavListClosed]);

    const handleLogout = () => {
        logout(); // Call the logout function from context
        console.log(user.role,'logout')
        //navigate('/'); // Redirect to home or login page after logout
    };

    return (
        <>
        <AnimatePresence>
            {!isNavListClosed && (
                <motion.section 
                    id = "navigationList" 
                    className = { styles.navBarList }
                    initial = {(window.innerWidth > 991) ? {translateY: 120, translateX: 20, opacity: 0} : {translateY: 80, translateX: 20, opacity: 0}}
                    animate = {{opacity: 1,}}
                    exit = {{
                        opacity: 0, 
                        translateX: 20, 
                        transition: {
                            duration: 0.21, 
                            delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 6 : 0.18 * 5,
                            ease: "easeInOut"
                        }}
                    }
                    transition = {{duration: 0.4, ease: "easeInOut"}}
                >

                    <ul className = { styles.navList }>
                        {isHamClicked && (
                            <motion.li 
                                key = {'newsAndEvents'}
                                onClick = { function() { handleModalClick(); captureNavListClick('newsAndEvents'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}//-80
                                exit = {{
                                    opacity: 0, 
                                    translateY: -80, 
                                    transition: {
                                        duration: 0.2, 
                                        delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 5 : 0.18 * 4,
                                        ease: "easeInOut",
                                    }
                                }}
                                transition = {{duration: 0.2, delay: 0.18 * 1, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.calendar}` } src = { icons.calendar } alt = "News and Events" />
                                <span className = { styles.text }>News and Events</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {'aboutUs'}
                                onClick = { function() { handleModalClick(); captureNavListClick('aboutUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{
                                    opacity: 0, 
                                    translateY: -80, 
                                    transition: {
                                        duration: 0.2, 
                                        delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 4 : 0.18 * 3,
                                        ease: "easeInOut",
                                    }
                                }}
                                transition = {{duration: 0.2, delay: 0.18 * 2, ease: "easeInOut"}}    
                            >
                                <img className = { `${styles.icon} ${styles.info}` } src = { icons.info } alt = "About Us" />
                                <span className = { styles.text }>About Us</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {'contactUs'}
                                onClick = { function() { handleModalClick(); captureNavListClick('contactUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{
                                    opacity: 0, 
                                    translateY: -80, 
                                    transition: {
                                        duration: 0.2, 
                                        delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 3 : 0.18 * 2,
                                        ease: "easeInOut",
                                    }
                                }}
                                transition = {{duration: 0.2, delay: 0.18 * 3, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.contact}` } src = { icons.contact } alt = "Contact Us" />
                                <span className = { styles.text }>Contact Us</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {'submitFeedback'}
                                onClick = { function() { handleModalClick(); captureNavListClick('submitFeedback'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{
                                    opacity: 0, 
                                    translateY: -80, 
                                    transition: {
                                        duration: 0.2, 
                                        delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 2 : 0.18,
                                        ease: "easeInOut",
                                    }
                                }}
                                transition = {{duration: 0.2, delay: 0.18 * 4, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.feedback}` } src = { icons.feedback } alt = "Submit Feedback" />
                                <span className = { styles.text }>Submit Feedback</span>
                            </motion.li>
                        )}
                        
                        {/* Edit content option */}
                        {(user?.role === "staff" || user?.role === "admin") && (
                            <div className = { styles.editListWrapper }>
                                {isHamClicked && (
                                    <motion.li 
                                        key = {'Edit Content'}
                                        onClick = { () => navigate("/analytics") }
                                        initial = {{opacity: 0, translateY: -40}}
                                        animate = {{opacity: 1, translateY: !isHamClicked ? -40 : 0}}
                                        exit = {{
                                            opacity: 0, 
                                            translateY: -40, 
                                            transition: {
                                                duration: 0.18, 
                                                delay: 0.18,
                                                ease: "easeInOut"
                                            }}
                                        }
                                        transition = {{duration: 0.2, delay: 0.18 * 5, ease: "easeInOut"}}
                                    >
                                        <img className = { `${styles.icon} ${styles.feedback}` } src = { icons.pencil } alt = "Editor Dashboard" />
                                        <span className = { styles.text }>Editor Dashboard</span>

                                    </motion.li>
                                )}
                            </div>
                        )}

                        {/* Logout */}
                        {isHamClicked && (
                            <motion.li 
                            key = {'signin'}
                            className = { styles.list }
                            onClick = { (user?.role === "admin" || user?.role === "staff") ? handleLogout : null }
                            initial = {{opacity: 0, translateY: -80}}
                            animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                            exit = {{
                                opacity: 0, 
                                translateY: -80, 
                                transition: {
                                    duration: 0.2, 
                                    delay: 0,
                                    ease: "easeInOut",
                                }
                            }}
                            transition = {{
                                duration: 0.2, 
                                delay: user?.role === "staff" || user?.role === "admin" ? 0.18 * 6 : 0.18 * 5, 
                                ease: "easeInOut"
                            }}
                            >
                                <img className = { `${styles.icon} ${styles.signin}` } src = {icons.signIn} alt = "Signin"/>
                                <span className = { styles.text }>
                                    {(user?.role === "admin" || user?.role === "staff")
                                        ? <>Log Out</>
                                        : <Link to = "/">Sign in</Link>
                                    }
                                </span>
                            </motion.li>
                        )}
                    </ul>
            </motion.section>
            )}
        </AnimatePresence>
        </>
    )
}