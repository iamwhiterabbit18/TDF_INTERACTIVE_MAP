/* 
-- Files where SubmitFeedback is imported --
NavigationModule.jsx

*/

import { React, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles/submitFeedbackStyles.module.scss';
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx';

export default function NewsAndEvents({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) {

    const numberOfStars = [1, 2, 3, 4, 5]; // array of the star rating
    const [selectedStar, setSelectedStar] = useState (-1);
    const [isStarClicked, setIsStarClicked] = useState(false);

    function handleStarClick(index) {
        setIsStarClicked(!isStarClicked);
        setSelectedStar(index);
    }

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
                {currentModal === 'submitFeedback' && (
                    <motion.div
                        className = { ` ${ styles.submitFeedbackContainer } ${ props.className }` }
                        id = "submitFeedback"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.submitFeedbackContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>
                            <span className = { styles.txtTitle }>Submit FeedBack</span>
                            <p className = { styles.txtSubTitle }> 
                                We highly value your feedback. Kindly take a <br/> 
                                moment to rate your experience and <br/>
                                provide us with your valuable feedback. 
                            </p>
                            <div className = { styles.starContainer }>
                                {numberOfStars.map((_ , index) => (
                                    <img 
                                        key = { index }
                                        onClick = {() => {handleStarClick(index)}}
                                        // compares the key of selected star to the rest of the star icons
                                        className = { selectedStar >= index ? `${ styles.icon } ${ styles.star } ${ styles.active }` : `${ styles.icon } ${ styles.star }`} 
                                        src = { icons.star } 
                                        alt = {`${index + 1} "Star raiting"`} 
                                    />
                                ))}
                        </div>
                        <form className = { styles.form }>
                            <textarea name = "feedback" />
                            <button className = { `${styles.button} ${styles.submitBtn}` }>Submit</button>
                        </form>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}