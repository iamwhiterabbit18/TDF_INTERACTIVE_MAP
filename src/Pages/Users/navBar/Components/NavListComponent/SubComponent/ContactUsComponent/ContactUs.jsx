/* 
-- Files where ContactUs is imported --
ContactUsModule.jsx

*/

import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './styles/contactUsStyles.module.scss';
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx';


export default function ContactUs({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) { // isModalActive is a prop from NavListComponent

    const [contactUsData, setContactUsData] = useState({
        location: '',
        telephone: '',
        email: '',
        facebookPage: '',
    });

    const fetchContactUsData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/contact');
            setContactUsData(response.data);
        } catch (error) {
            console.error("Error fetching Contact Us data:", error);
        }
    };

    useEffect(() => {
        if (currentModal === 'contactUs') {
            fetchContactUsData();
        }
    }, [currentModal]);  // Runs once on mount

    const location = useLocation();
    const { user: authUser } = useAuth();
    const user = location.state?.user || authUser;

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
            <AnimatePresence mode="wait">
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
                                    <p className = { styles.txtSubTitle }>{contactUsData.location}</p>

                                    <span className = { styles.txtTitle }>Telephone Number: </span>
                                    <p className = { styles.txtSubTitle }>{contactUsData.telephone}</p>

                                    <span className = { styles.txtTitle }>Email: </span>
                                    <p className = { styles.txtSubTitle }>{contactUsData.email}</p>

                                    <span className = { styles.txtTitle }>Facebook Page: </span>
                                    <p className = { styles.txtSubTitle }>{contactUsData.facebookPage}</p>

                                </div>
                            </div>
                        </motion.div>

                        {/* Edit button */}
                        {(user?.role === "staff" || user?.role === "admin") && (
                            <motion.button 
                            className = { styles.editBtn }
                            initial = {{opacity: 0}}
                            animate = {{opacity: 1}}
                            exit = {{opacity: 0}}
                            transition = {{ duration: 0.3, ease: "easeInOut"}}
                            >
                                <span className = { styles.txtTitle } onClick = { function() { setCurrentModal("contactUsEdit"); } }>Edit Contacts</span>
                            </motion.button>
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    )
}