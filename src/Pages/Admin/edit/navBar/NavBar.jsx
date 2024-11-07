import styles from "./styles/navBarStyles.module.scss";
import icons from "../../../../assets/for_landingPage/Icons";

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavBar () {

    const [isNavBarActive, setIsNavBarActive] = useState(false);

    function handleMenuClick() {
        setIsNavBarActive(!isNavBarActive);
    }
    
    const location = useLocation();
    const { user: authUser, logout } = useAuth();
    const user = location.state?.user || authUser;

    const handleLogout = () => {
        logout(); // Call the logout function from context
        console.log(user.role,'logout')
        //navigate('/'); // Redirect to home or login page after logout
    };

    console.log (isNavBarActive);

    return (
        <>
            <AnimatePresence>
                <motion.section 
                    className = { styles.navBar }

                    //for mobile animation
                    initial = {{ translateX: -179.2 }}
                    animate = { isNavBarActive || window.innerWidth > 767.99 ? { translateX: 0} : { translateX: -179.2}}
                    transition = {{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className = { styles.menu } onClick = { handleMenuClick }>
                        <div className = { styles.line }></div>
                        <span>Menu</span>
                    </div>
                    
                    <div className = { styles.greeting }>
                        <div className = { styles.iconContainer }>
                            <img className = { `${ styles.icon } ${ styles.user }` }src = { icons.user } alt = "User Icon" />
                        </div>
                        <span className = { styles.txtTitle }>Welcome, <br/> User</span>
                    </div>

                    {/* line separator */}
                    <div className = { styles.line }></div>

                    <ul className = { styles.navList }>
                        <li
                            onClick = {() => window.location.href = "/map"}
                        >
                            <img className = { `${styles.icon} ${styles.map}` } src ={ icons.map } />
                            <span className = { styles.text }>Map</span>
                        </li>
                        <li
                            className = { location.pathname === "/cards" ? styles.activeList : undefined }
                            onClick = {() => window.location.href = "/cards"}
                        >
                            <img className = { `${styles.icon} ${styles.map}` } src ={ icons.card } />
                            <span className = { styles.text }>Edit Cards</span>
                        </li>
                        <li
                            className = { location.pathname === "/modal" ? styles.activeList : undefined }
                            onClick = {() => window.location.href = "/modal"}
                        >
                            <img className = { `${styles.icon} ${styles.map}` } src ={ icons.edit } />
                            <span className = { styles.text }>Edit Modal</span>
                        </li>
                        <li
                            className = { location.pathname === "/audio" ? styles.activeList : undefined }
                            onClick = {() => window.location.href = "/audio"}
                        >
                            <img className = { `${styles.icon} ${styles.map}` } src ={ icons.upload } />
                            <span className = { styles.text }>Edit Audio</span>
                        </li>
                        {user?.role === "admin" && (
                            <li
                                className = { location.pathname === "/usermanage" ? styles.activeList : undefined }
                                onClick = {() => window.location.href = "/usermanage"}
                            >
                                <img className = { `${styles.icon} ${styles.map}` } src ={ icons.profile } />
                                <span className = { styles.text }>User <br />Management</span>
                            </li>
                        )}
                        
                    </ul>

                    {/* line separator */}
                    <div className = { styles.footer }>
                        <div className = { styles.line }></div>

                        <div className = { styles.logout } onClick = { handleLogout }>
                            <img className = { `${styles.icon} ${styles.logout}` } src = {icons.signIn} alt = "Signin"/>
                            <span className = { styles.text }>Log Out</span>
                        </div>
                    </div>
                </motion.section>
            </AnimatePresence>
        </>
    )
}