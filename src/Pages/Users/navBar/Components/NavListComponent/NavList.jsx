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
            <section id = "navigationList" className = { isHamClicked && !isNavListClosed ? `${styles.navBarList} ${styles.active}`: styles.navBarList }> {/* navBarList active (for showing list if hamburger is clicked) */}
                {/* <div class = "minimize">min</div> [add it after main nav list is done] */}
                <ul className = { styles.navList }> 
                    <AnimatePresence>
                        {isHamClicked && (
                            <motion.li
                                key = {1}
                                initial = {{opacity: 0, translateY: -50}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -50 : 0}}
                                exit = {{opacity: 0, translateY: -50, transition: {duration: 0.6}}}
                                transition = {{duration: 0.6, delay: 0.4, ease: "easeInOut"}}
                                
                            >
                                <img className = { `${styles.icon} ${styles.map}` } src = { icons.map } alt = "Map" />
                                <span className = { styles.text }>Map</span>
                            </motion.li>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isHamClicked && (
                            <motion.li 
                                key = {2}
                                onClick = { function() { handleModalClick(); captureNavListClick('newsAndEvents'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}//-80
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.6}}}
                                transition = {{duration: 0.6, delay: 0.4 * 2, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.calendar}` } src = { icons.calendar } alt = "News and Events" />
                                <span className = { styles.text }>News and Events</span>
                            </motion.li>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isHamClicked && (
                            <motion.li 
                                key = {3}
                                onClick = { function() { handleModalClick(); captureNavListClick('aboutUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.6}}}
                                transition = {{duration: 0.6, delay: 0.4 * 3, ease: "easeInOut"}}    
                            >
                                <img className = { `${styles.icon} ${styles.info}` } src = { icons.info } alt = "About Us" />
                                <span className = { styles.text }>About Us</span>
                            </motion.li>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isHamClicked && (
                            <motion.li 
                                key = {4}
                                onClick = { function() { handleModalClick(); captureNavListClick('contactUs'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.6}}}
                                transition = {{duration: 0.6, delay: 0.4 * 4, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.contact}` } src = { icons.contact } alt = "Contact Us" />
                                <span className = { styles.text }>Contact Us</span>
                            </motion.li>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isHamClicked && (
                            <motion.li 
                                key = {5}
                                onClick = { function() { handleModalClick(); captureNavListClick('submitFeedback'); } }
                                initial = {{opacity: 0, translateY: -80}}
                                animate = {{opacity: 1, translateY: !isHamClicked ? -80 : 0}}
                                exit = {{opacity: 0, translateY: -80, transition: {duration: 0.6}}}
                                transition = {{duration: 0.6, delay: 0.4 * 5, ease: "easeInOut"}}
                            >
                                <img className = { `${styles.icon} ${styles.feedback}` } src = { icons.feedback } alt = "Submit Feedback" />
                                <span className = { styles.text }>Submit Feedback</span>
                            </motion.li>
                        )}
                    </AnimatePresence>
                </ul>
            </section>
        </>
    )
}