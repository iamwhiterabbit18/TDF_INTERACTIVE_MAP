/* 
-- Files where NewsAndEvents is imported --
NavigationModule.jsx

*/
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles/newsAndEventsStyles.module.scss';
import icons from '../../../../../../../../assets/for_landingPage/Icons.jsx';


import ImageSlider from '../subComponent/ImageSlider.jsx';

export default function NewsAndEvents({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) {

    const slideImgs = [
        { url: "public/for_landingPage/images/image-1.jpg", title: "1stEvent" },
        { url: "public/for_landingPage/images/image-2.jpg", title: "2stEvent" },
        { url: "public/for_landingPage/images/image-3.jpg", title: "3stEvent" },
        { url: "public/for_landingPage/images/image-4.jpg", title: "4stEvent" }
    ]

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
                {currentModal === 'newsAndEvents' && (
                    <motion.div
                        className = { ` ${ styles.newsAndEventContainer } ${ props.className }` }
                        id = "newsAndEvents"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                    >
                        <div className = { styles.newsAndEventContent }>
                            <div className = { styles.close } onClick = { function() { setCurrentModal(null); }}>
                                <img src = { icons.close } alt = "Close" />
                                </div>
                            <span className = { styles.txtTitle }>News and Events</span>
                            <div className = { styles.imageSlider }>
                                <ImageSlider slideImgs = { slideImgs }/>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}