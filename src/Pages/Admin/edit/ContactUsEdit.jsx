import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import styles from "./styles/ContactUsEdit.module.scss"
import icons from '../../../assets/for_landingPage/Icons'

export default function ContactUsEdit ({ setCurrentModal, currentModal, handleClickOutside }) {

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
                {currentModal === "contactUsEdit" && (
                    <motion.div
                    className = { styles.editContainer }
                    id = "contactUsEdit"
                    initial = {{opacity: 0}}
                    animate = {{opacity: 1}}
                    exit = {{opacity: 0}}
                    transition = {{duration: 0.2, ease: "easeInOut"}}
                >
                    <div className = {styles.editingSection}>
                        <div className = { styles.close } onClick = { function() { setCurrentModal("contactUs"); }}>
                            <img src = { icons.close } alt = "Close" />
                        </div>

                        <div className = { styles.header }>
                            <span className = { styles.txtTitle }>Contact Us</span>
                        </div>
                        

                        <div className =  { styles.form }>
                            <span className = { styles.txtTitle }>Location: </span>
                            <textarea
                                className = { styles.txtSubTitle } 
                                placeholder = "Place information here..."
                            />

                            <span className = { styles.txtTitle }>Telephone Number: </span>
                            <textarea
                                className = { styles.txtSubTitle } 
                                placeholder = "Place information here..."
                            />

                            <span className = { styles.txtTitle }>Email: </span>
                            <textarea
                                className = { styles.txtSubTitle } 
                                placeholder = "Place information here..."
                            />

                            <span className = { styles.txtTitle }>Facebook Page: </span>
                            <textarea
                                className = { styles.txtSubTitle } 
                                placeholder = "Place information here..."
                            />

                        </div>
                    </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}