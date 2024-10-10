import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles/aboutUsStyles.module.scss'
import images from '../../../../../../../assets/for_landingPage/Images.jsx'
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx'

export default function AboutUs({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) {

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
                {currentModal === 'aboutUs' && (
                    <motion.div
                        className = { `${ styles.aboutUsContainer } ${ props.className }` }
                        id = "aboutUs"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.aboutUsContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                            </div>
                            <div className = { styles.firstSubContainer }>
                                <div className = { styles.firstSubGroup }>
                                    <span className = { styles.txtTitle }>About Us</span>
                                    <p className = { styles.txtSubTitle }>Lorem Espasol</p>
                                </div>
                            <div className = { styles.secondSubGroup }>
                                <img className = { styles.highlightImg } src = { images.Pigs }alt = "Image Highlight"></img>
                            </div>
                        </div>
                    
                            <div className = { styles.secondSubGroup }>
                                <span className = { styles.txtTitle}>Historical Background</span>
                                <p className = { styles.txtSubTitle}>Lorem Espasol</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}