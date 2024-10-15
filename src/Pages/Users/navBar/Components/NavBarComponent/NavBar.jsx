/* 
-- Files where NavBar is imported --
NavigationModule.jsx

*/

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/navBarStyles.module.scss';

export default function NavBar({ isHamClicked, isNavListClosed, handleNavClick, handleDropClick }) {

    // adds the className rootContainer to the #root and removes it once the component unmounts
    useEffect(function() {
        var root = document.getElementById('root');
        // adds the className rootContainer to the #root
        root.classList.add(styles.rootNavigation);

        //removes the className once unmount
        return function() {
            root.classList.remove(styles.rootNavigation);
        };
    }, []);

    return (
        <>
            <section className = { styles.navBar }>
                <div /* className = "menu" */>
                    <ul>
                        <motion.li 
                            id = "hamburger"
                            className = { `${ styles.icon } ${ styles.hamburger }` } 
                            onClick = { handleNavClick }
                            initial = {{rotate: 0}}
                            animate = {{rotate: isHamClicked? 450 : 0}} //270
                            transition = {{duration: 1}} //0.8
                        >
                            <img 
                                //change the used icon depending on the set bool value of isCliked
                                src = { icons.hamburger } 
                                alt = "hamburger" 
                            />
                        </motion.li>

                        
                        {/* <li className = { `${ styles.icon } ${ styles.logo }` }>
                            <span>LOGO</span>
                        </li> */}
                    </ul>
                </div>
                <div /* className = "user" */>
                    <ul>

                        {/* Removed 10/09/2024 for redesign */}
                        {/* <li className = { `${ styles.icon } ${ styles.web }` }>
                            <img src = { icons.globe } alt = "Web" />
                        </li>
                        <li className = { `${ styles.icon } ${ styles.facebook }` }>
                            <img src = { icons.fb } alt = "Facebook" />
                        </li>
                        <li className = { `${ styles.icon } ${ styles.youtube }` }>
                            <img src = { icons.yt } alt = "Youtube" />
                        </li> */}
                        <li id = "userIcon" className = { `${ styles.icon } ${ styles.user }` } onClick = { handleDropClick }>
                            <img src = { icons.user } alt = "User Icon" />
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )

    
}