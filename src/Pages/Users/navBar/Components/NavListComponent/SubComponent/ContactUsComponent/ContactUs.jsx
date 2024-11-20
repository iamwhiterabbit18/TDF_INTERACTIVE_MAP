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
                    <>
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

                                <div className = { styles.header }>
                                    <span className = { styles.txtTitle }>Contact Us</span>
                                </div>
                                

                                <div className =  { styles.form }>
                                    <span className = { styles.txtTitle }>Location: </span>
                                    <p className = { styles.txtSubTitle }>Cavite State University, Brgy. Bancod, Indang, Cavite, Indang, Philippines, 4122</p>

                                    <span className = { styles.txtTitle }>Telephone Number: </span>
                                    <p className = { styles.txtSubTitle }>(046) 482 2010</p>

                                    <span className = { styles.txtTitle }>Email: </span>
                                    <p className = { styles.txtSubTitle }>extension@cvsu.edu.ph</p>

                                    <span className = { styles.txtTitle }>Facebook Page: </span>
                                    <p className = { styles.txtSubTitle }>https://www.facebook.com/CvSUExtensionServices</p>
                                    <p className = { styles.txtSubTitle }>https://www.facebook.com/pages/Cavite%20State%20University%20-%20Technology%20Demonstration%20Farm/107503934805285/</p>

                                </div>
                            </div>
                        </motion.div>
                        <motion.button 
                            className = { styles.editBtn }
                            initial = {{opacity: 0}}
                            animate = {{opacity: 1}}
                            exit = {{opacity: 0}}
                            transition = {{ duration: 0.3, ease: "easeInOut"}}
                        >
                            <span className = { styles.txtTitle } onClick = { function() { setCurrentModal("contactUsEdit"); } }>Edit here</span>
                        </motion.button>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}