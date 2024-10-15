/* 
-- Files where ContactUs is imported --
ContactUsModule.jsx

*/

import { motion, AnimatePresence } from 'framer-motion'

import { useEffect } from 'react';
import styles from './styles/contactUsStyles.module.scss';
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx';


export default function ContactUs({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) { // isModalActive is a prop from NavListComponent

    // closes the modal box if the user clicked outside (anywhere in the screen except the modal box)
    useEffect(function() {
        if (currentModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentModal]);

    return (
        <>
            <AnimatePresence>
                {currentModal === 'contactUs' && (
                    <motion.div
                        className = { `${ styles.contactUsContainer } ${ props.className }` }
                        id = "contactUs"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.contactUsContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>
                            <span className = { styles.txtTitle }>Contact Us</span>
                            <form className =  { styles.form }>
                                <label htmlFor = "name">Name</label>
                                <input 
                                    autoComplete = "off"
                                    name = "name"
                                    type = "text"
                                />

                                <label htmlFor = "email">Email</label>
                                <input
                                    autoComplete = "off"
                                    name = "email"
                                    type = "email"
                                />

                                <label htmlFor = "question">Question</label>
                                <textarea 
                                    name = "question"
                                />

                                <button className = { styles.submitBtn }>Submit</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}