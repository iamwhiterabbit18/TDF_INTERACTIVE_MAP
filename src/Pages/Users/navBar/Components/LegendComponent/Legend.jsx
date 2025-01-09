// For all menus, add a function where the menus will disappear when the user click outside

/* 
-- Files where UserDropdown is imported --
NavigationModule.jsx

*/

import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate, } from 'react-router-dom';
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import axios from 'axios';


import legend from '../../../../../assets/icon/Icons.js';
import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/legendStyles.module.scss';

export default function Legend() {
    const [markerIcons, setMarkerIcons] = useState([]);

    // Fetch marker icons
    const fetchMarkerIcons = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/markerIcons');
            // Map the API response to the desired structure
            const formattedData = response.data.map((icon) => ({
                name: icon.name,
                icon: `http://localhost:5000/uploads/icons/${icon.iconPath}`, // Construct the image URL
            }));
            setMarkerIcons(formattedData);
        } catch (error) {
            console.error('Error fetching marker icons:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchMarkerIcons();
    }, []);

    return (
        <>
            <AnimatePresence>
                    <motion.div
                        className = { styles.compassLegendCont }
                        // initial = {window.innerWidth > 992 ? {opacity: 0, translateY: 70, translateX: -37} : {opacity: 0, translateY: 70, translateX: -10}}
                        // animate = {window.innerWidth > 992 ? {opacity: 1, translateY: 120} : {opacity: 1, translateY: 100}}
                        // exit = {{opacity: 0, translateY: 70}}
                        // transition = {{ duration: 0.3, ease: "easeInOut"}}
                    
                    >   
                        
                        <div className = { styles.content } >
                            <div className = { styles.compass }>
                                <img className = { `${styles.icon} ${styles.compass}` } src = { icons.compass } alt = "Compass"/>
                            </div>
                                          <section className={styles.legend}>
                            <div className={styles.header}>
                                <span className={styles.txtTitle}>Map Legend</span>
                            </div>
                            <ul className={styles.legendList}>
                                {markerIcons.map((icon, index) => (
                                    <li key={`legend-${index}`}>
                                        <span className={styles.text}>{icon.name}</span>
                                        <img
                                            className={`${styles.icon} ${styles.signin}`}
                                            src={icon.icon}
                                            alt={icon.name}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                        </div>
                    </motion.div>
            </AnimatePresence>
        </>
    )
}