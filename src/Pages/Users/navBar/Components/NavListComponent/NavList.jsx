/* 
-- Files where NavList is imported --
NavigationModule.jsx

*/

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import icons from '../../../../../assets/for_landingPage/Icons.jsx';
import styles from './styles/navListStyles.module.scss';

export default function NavList ({ handleClickOutside, isHamClicked, isNavListClosed, handleModalClick, captureNavListClick }) {

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

    return (
        <>
        <AnimatePresence>
            {isHamClicked && (
                <motion.section 
                    id = "navigationList" 
                    className = { styles.navBarList }
                    initial = {{opacity: 0, translateY: 120, translateX: 20}}
                    animate = {{opacity: 1,}}
                    exit = {{opacity: 0, translateX: 20, transition: {duration: 0.21, delay: 0.72, ease: "easeInOut"}}}
                    transition = {{duration: 0.4, ease: "easeInOut"}}
                >
                    {/* <div class = "minimize">min</div> [add it after main nav list is done] */}
                    <ul className = { styles.navList }> 
                        {isHamClicked && (
                            <motion.li
                                key = {1}
                                initial = {{opacity: 0, translateY: -50}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -50 : 0}}
                                exit = {{opacity: 0, translateY: -50, transition: {duration: 0.2, delay: 0.18 * 4, ease: "easeInOut"}}}
                                transition = {{duration: 0.2, ease: "easeInOut"}}
                                
                            >
                                <img className = { `${styles.icon} ${styles.map}` } src = { icons.map } alt = "Map" />
                                <span className = { styles.text }>Map</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {2}
                                onClick = { function() { handleModalClick(); captureNavListClick('newsAndEvents'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}//-80
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.2, delay: 0.18 * 3, ease: "easeInOut"}}}
                                transition = {{duration: 0.2, delay: 0.18 * 1, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.calendar}` } src = { icons.calendar } alt = "News and Events" />
                                <span className = { styles.text }>News and Events</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {3}
                                onClick = { function() { handleModalClick(); captureNavListClick('aboutUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.2, delay: 0.18 * 2, ease: "easeInOut"}}}
                                transition = {{duration: 0.2, delay: 0.18 * 2, ease: "easeInOut"}}    
                            >
                                <img className = { `${styles.icon} ${styles.info}` } src = { icons.info } alt = "About Us" />
                                <span className = { styles.text }>About Us</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {4}
                                onClick = { function() { handleModalClick(); captureNavListClick('contactUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.2, delay: 0.18, ease: "easeInOut"}}}
                                transition = {{duration: 0.2, delay: 0.18 * 3, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.contact}` } src = { icons.contact } alt = "Contact Us" />
                                <span className = { styles.text }>Contact Us</span>
                            </motion.li>
                        )}
                        {isHamClicked && (
                            <motion.li 
                                key = {5}
                                onClick = { function() { handleModalClick(); captureNavListClick('submitFeedback'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.18, ease: "easeInOut"}}}
                                transition = {{duration: 0.2, delay: 0.18 * 4, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.feedback}` } src = { icons.feedback } alt = "Submit Feedback" />
                                <span className = { styles.text }>Submit Feedback</span>
                            </motion.li>
                        )}
                    </ul>
            </motion.section>
            )}
        </AnimatePresence>
        </>
    )
}