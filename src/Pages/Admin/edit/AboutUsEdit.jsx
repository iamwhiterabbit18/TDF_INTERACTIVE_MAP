import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confirmation from '../utility/ConfirmationComponent/Confirmation'

import styles from './styles/AboutUsEdit.module.scss'
import icons from '../../../assets/for_landingPage/Icons'

export default function AboutUsEdit ({ setCurrentModal, currentModal, handleClickOutside }) {
    
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
                {currentModal === 'aboutUsEdit' && (
                    <motion.div
                        className = { styles.editContainer }
                        id = "aboutUsEdit"
                        initial = {{ opacity: 0 }}
                        animate = {{ opacity: 1 }}
                        exit = {{ opacity: 0 }}
                        transition = {{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <div className = { styles.editingSection }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal("aboutUs"); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>
                            
                            <div className = { styles.header }>
                                <span className = { styles.txtTitle }>About Us</span>
                            </div>

                            <div className = { styles.content }>
                                {/* <img src = { images.aboutUs } alt = "Extension Services Image" />  */}
                                
                                {/* If no image [placeholder] */}
                                <div className = { styles.noImg }>
                                    <span className = { styles.txtTitle}> No Image Uploaded </span>
                                </div>

                                <div className = { styles.history }>
                                    <span className = { styles.txtTitle }>Historical Background</span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        placeholder = "Place information here..."
                                    />
                                </div>

                                <div className = { styles.vision}>
                                    <span className = { styles.txtTitle }>Vision</span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        placeholder = "Place information here..."
                                    />
                                </div>

                                <div className = { styles.mission}>
                                    <span className = { styles.txtTitle }>Mission</span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        placeholder = "Place information here..."
                                    />
                                </div>

                                <div className = { styles.goal}>
                                    <span className = { styles.txtTitle }>Goal</span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        placeholder = "Place information here..."
                                    />
                                </div>

                                <div className = { styles.objective}>
                                    <span className = { styles.txtTitle }>Objectives</span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        placeholder = "Place information here..."
                                    />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

