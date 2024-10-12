import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './styles/optionStyles.module.scss';

import { motion, AnimatePresence } from 'framer-motion'

export default function Option({ handleBtnClick, isBtnClicked, handleUser }) {

    return (
        <>
            <AnimatePresence>
                {!isBtnClicked && (
                    <motion.div 
                        className = { styles.optionContent } 
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0, transition: {delay: 0}}}
                        transition = {{duration: 0.3, delay: 0.2, ease: "easeInOut"}}
                    >
                        <span className = { styles.txtTitle }>Login</span>
                        <button className = { `${styles.button} ${styles.btnSignIn}` } onClick = { handleBtnClick }>Sign in</button>
                        <span className = { styles.txtSubTitle }>OR</span>
                        <button className = { `${styles.button} ${styles.btnGuest}`}
                            onClick = { () => handleUser('Guest') }>
                            <Link to ={ "/map"}>Guest Login</Link>
                        </button> 
                    </motion.div>  
                )}
            </AnimatePresence>
        </>
    )
}