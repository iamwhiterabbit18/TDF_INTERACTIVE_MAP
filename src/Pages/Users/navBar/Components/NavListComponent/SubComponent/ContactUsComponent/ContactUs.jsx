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

    // for contact info
    const [activeInfo, setActiveInfo] = useState(null);

    function handleContactClick(info) {
        setActiveInfo(info === activeInfo ? null : info);
    }

    console.log(activeInfo);

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
                                <div className = { styles.close } onClick = { function() { setCurrentModal(null); setActiveInfo(null) }}>
                                    <img src = { icons.close } alt = "Close" />
                                </div>

                                <div className = { styles.header }>
                                    <span className = { styles.txtTitle }>Contact Us</span>
                                </div>

                                <div className =  { styles.contacts }>
                                    <img onClick = {() => handleContactClick('location')} src = { icons.location} alt = "Location" />
                                    <img onClick = {() => handleContactClick('number')} src = { icons.contact} alt = "Contact Number" />
                                    <img onClick = {() => handleContactClick('email')} src = { icons.email} alt = "Email" />
                                    <img onClick = {() => handleContactClick('facebook')} src = { icons.facebook} alt = "Facebook" />
                                </div>

                                <div className = { styles.info }>
                                    <p className = { activeInfo === "location" ? `${ styles.txtSubTitle } ${ styles.location } ${ styles.active }` : `${ styles.txtSubTitle } ${ styles.location }` }>
                                        {contactUsData.location}
                                    </p>
                                    <p className = { activeInfo === "number" ? `${ styles.txtSubTitle } ${ styles.number } ${ styles.active }` : `${ styles.txtSubTitle } ${ styles.number }` }>
                                        {contactUsData.telephone}
                                    </p>
                                    <p className = { activeInfo === "email" ? `${ styles.txtSubTitle } ${ styles.email } ${ styles.active }` : `${ styles.txtSubTitle } ${ styles.email }` }>
                                        {contactUsData.email}
                                    </p>
                                    <p className = { activeInfo === "facebook" ? `${ styles.txtSubTitle } ${ styles.facebook } ${ styles.active }` : `${ styles.txtSubTitle } ${ styles.facebook }` }>
                                        {contactUsData.facebookPage}
                                    </p>
                                </div>
                                
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