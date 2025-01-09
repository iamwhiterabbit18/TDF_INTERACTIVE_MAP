/* 
-- Files where ContactUs is imported --
ContactUsModule.jsx

*/

import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext'
import { useLocation } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import axios from 'axios';

import UseToast from '../../../../../../Admin/utility/AlertComponent/UseToast.jsx';

import styles from './styles/contactUsStyles.module.scss';
import icons from '../../../../../../../assets/for_landingPage/Icons.jsx';


export default function ContactUs({ setCurrentModal, handleClickOutside, currentModal, nodeRef, ...props }) { // isModalActive is a prop from NavListComponent

    // toast alert pop up
    const mountToast = UseToast();
    
    const [contactUsData, setContactUsData] = useState({
        location: '',
        telephone: '',
        email: '',
        facebookPage: '',
    });

    const fetchContactUsData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contact');
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

    // Handler for user message sent to client email
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        formData.append("access_key", "bc61024f-bc8c-407c-8805-b5d73b18ae51"); // using web3forms, replace with the access key for the client email
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
            mountToast("Message sent!", "success");
        } else {
            mountToast("Message not sent!", "error");
        }
      };

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

                                <form className =  { styles.form } onSubmit={onSubmit}>
                                    <label htmlFor = "name">Name</label>
                                    <input 
                                        autoComplete = "off"
                                        name = "name"
                                        type = "text"
                                        required
                                    />

                                    <label htmlFor = "email">Email</label>
                                    <input
                                        autoComplete = "off"
                                        name = "email"
                                        type = "email"
                                        required
                                    />

                                    <label htmlFor = "question">Question</label>
                                    <textarea 
                                        name = "question"
                                        required
                                    />

                                    <button className = { styles.submitBtn } type="submit">Submit</button>
                                </form>

                               

                                <div className =  { styles.contacts }>
                                {/* <span>Click to view</span> */}
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
                                    <img onClick = {() => handleContactClick('location')} src = { icons.location} alt = "Location" />
                                    <img onClick = {() => handleContactClick('number')} src = { icons.contact} alt = "Contact Number" />
                                    <img onClick = {() => handleContactClick('email')} src = { icons.email} alt = "Email" />
                                    <img onClick = {() => handleContactClick('facebook')} src = { icons.facebook} alt = "Facebook" />
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