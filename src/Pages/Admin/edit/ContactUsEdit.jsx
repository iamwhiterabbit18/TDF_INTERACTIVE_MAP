import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios';

import UseToast from '../utility/AlertComponent/UseToast';

import styles from "./styles/ContactUsEdit.module.scss";
import icons from '../../../assets/for_landingPage/Icons';
import { style } from 'framer-motion/client';

export default function ContactUsEdit ({ setCurrentModal, currentModal, handleClickOutside }) {

    // toast alert pop up
    const mountToast = UseToast();

    const [contactUsData, setContactUsData] = useState({
        location: '',
        telephone: '',
        email: '',
        facebookPage: ''
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
        if (currentModal === 'contactUsEdit') {
            fetchContactUsData();
        }
    }, [currentModal]); // Empty dependency array to run only once on mount
    

    const handleChangeDetails = (e) => {
        const { name, value } = e.target;
        setContactUsData({ ...contactUsData, [name]: value });
    };

    const handleSaveDetails = async () => {
        // Destructure fields for validation
        const { location, telephone, email, facebookPage } = contactUsData;
    
        // Check if any field is empty
        if (!location || !telephone || !email || !facebookPage) {
            mountToast("Please fill in all fields before saving.", "error");
            setCurrentModal("contactUs");
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:5000/api/contact', contactUsData);
            
            mountToast("Contacts updated successfully", "success");
            setCurrentModal("contactUs");  // Close modal after saving
            fetchContactUsData();  // Refresh data if needed
    
        } catch (error) {
            // Check if error is specifically due to no changes detected (status 400)
            if (error.response && error.response.status === 400 &&
                error.response.data.message === 'No changes detected in the data.') {
                mountToast("No changes detected. Contact data was not updated.", "error");
                setCurrentModal("contactUs");
            } else {
                console.error("Error saving Contact Us data:", error);
            }
        }
    };

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
            <AnimatePresence mode = "wait">
                {currentModal === "contactUsEdit" && (
                    <div className = { styles.holder }>
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
                                        name="location"
                                        value={contactUsData.location}
                                        onChange={handleChangeDetails}
                                        placeholder = "Place information here..."
                                    />

                                    <span className = { styles.txtTitle }>Telephone Number: </span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        name="telephone"
                                        value={contactUsData.telephone}
                                        onChange={handleChangeDetails}
                                        placeholder = "Place information here..."
                                    />

                                    <span className = { styles.txtTitle }>Email: </span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        name="email"
                                        value={contactUsData.email}
                                        onChange={handleChangeDetails}
                                        placeholder = "Place information here..."
                                    />

                                    <span className = { styles.txtTitle }>Facebook Page: </span>
                                    <textarea
                                        className = { styles.txtSubTitle } 
                                        name="facebookPage"
                                        value={contactUsData.facebookPage}
                                        onChange={handleChangeDetails}
                                        placeholder = "Place information here..."
                                    />

                                </div>
                            </div>
                        </motion.div>

                        <motion.button 
                        className = { styles.saveBtn }
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{ duration: 0.3, ease: "easeInOut"}}
                        >
                            <span className = { styles.txtTitle } onClick = { handleSaveDetails }>Save Changes</span>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}