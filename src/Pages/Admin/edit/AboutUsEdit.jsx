import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios';
import Confirmation from '../utility/ConfirmationComponent/Confirmation'

import styles from './styles/AboutUsEdit.module.scss'
import icons from '../../../assets/for_landingPage/Icons'

export default function AboutUsEdit ({ setCurrentModal, currentModal, handleClickOutside }) {
    
    const [aboutUsData, setAboutUsData] = useState({
        historicalBackground: '',
        vision: '',
        mission: '',
        goal: '',
        objectives: '',
        image: '',
    });
    const [selectedImage, setSelectedImage] = useState(null); // New state for storing the selected image file
    const [previewImage, setPreviewImage] = useState(null);   // State to store the image preview URL

    const fetchAboutUsData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/aboutus');
            setAboutUsData(response.data);
        } catch (error) {
            console.error("Error fetching About Us data:", error);
        }
    };
    useEffect(() => {
        if (currentModal === 'aboutUsEdit') {
            fetchAboutUsData();
        }
    }, [currentModal]); // Empty dependency array means this runs only once, when the component mounts
    

    const handleChangeDetails = (e) => {
        const { name, value } = e.target;
        setAboutUsData({ ...aboutUsData, [name]: value });
    };

    const handleSaveDetails = async () => {
        // Check if any field is empty
        const { historicalBackground, vision, mission, goal, objectives } = aboutUsData;
        if (!historicalBackground || !vision || !mission || !goal || !objectives) {
            alert("Please fill in all fields before saving.");
            return;
        }
    
        try {
            const response = await axios.put('http://127.0.0.1:5000/api/aboutus', aboutUsData);
            
            alert("About Us updated successfully");
            setCurrentModal("aboutUs");  // Close modal after saving
            fetchAboutUsData();
        } catch (error) {
            // Check if the error is specifically due to no changes detected (status 400)
            if (error.response && error.response.status === 400 && 
                error.response.data.message === 'No changes detected in the data.') {
                alert('No changes detected. Details was not updated.');
            } else {
                console.error("Error saving About Us data:", error);
            }
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file); 
            setPreviewImage(URL.createObjectURL(file)); // Set preview URL
        }
    };

    const handleUpdateImage = async () => {
        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.put('http://127.0.0.1:5000/api/aboutus/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Image updated successfully");
            fetchAboutUsData();
            setSelectedImage(null); // Clear the selected image after upload
            setPreviewImage(null); // Clear blob image preview
            setCurrentModal("aboutUs"); 
        } catch (error) {
            console.error("Error updating image:", error);
        }
    };

    const handleDeleteImage = async () => {
        try {
            if (selectedImage) {
                await axios.delete('http://127.0.0.1:5000/api/aboutus/image');
                alert("Image deleted successfully.");
                fetchAboutUsData();  // Refresh data after deletion
                setDeleteModalVisible(null);
            }

        } catch (error) {
            console.error("Error deleting image:", error);
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

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const confirmAndDelete = () => {
        setConfirmDelete(true);
    }

    useEffect(() => {
        if (confirmDelete && selectedImage) {
            handleDeleteImage();
            setConfirmDelete(false);
        }
    }, [confirmDelete, selectedImage]);

    const cancelBtn = () => {
        setDeleteModalVisible(false);
    };


    return (
        <>
            <AnimatePresence>
                {currentModal === 'aboutUsEdit' && (
                    <div className = { styles.holder }>
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
                                    {/* Show the preview if available, else show the stored image or placeholder */}
                                    {previewImage ? (
                                        <div className = { styles.preview }>
                                            <img src={previewImage} alt="Preview" className={styles.imgPreview} />

                                            <div className = { styles.overlay }>
                                                <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>Upload Image</button>
                                            </div>

                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </div>
                                    ) : aboutUsData.image ? (
                                        <div className = { styles.uploaded }>
                                            <img 
                                                src={`http://127.0.0.1:5000/uploads/images/${aboutUsData.image}`} 
                                                alt="About Us" 
                                                className={styles.imgPreview} 
                                            />

                                            <div className = { styles.overlay }>
                                                <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>
                                                    Upload Image
                                                    <input
                                                        type="file"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </button>

                                                <button 
                                                    className = { `${ styles.txtTitle} ${ styles.deleteBtn }` } 
                                                    onClick={() => {setDeleteModalVisible(true); setSelectedImage(aboutUsData.image);} } //handleDeleteImage
                                                >
                                                    Delete Image
                                                </button>

                                            </div>
                                        </div>
                                    ) : (
                                        <div className = { styles.noImg }>
                                            <div className = { styles.overlay }>
                                                <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>Upload Image</button>
                                            </div>

                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />

                                            <span className={styles.txtTitle}>No Image Uploaded</span>
                                        </div>
                                    )}
                                    

                                    <div className = { styles.history }>
                                        <span className = { styles.txtTitle }>Historical Background</span>
                                        <textarea
                                            className = { styles.txtSubTitle } 
                                            placeholder = "Place information here..."
                                            name="historicalBackground"
                                            value={aboutUsData.historicalBackground}
                                            onChange={handleChangeDetails}
                                        />
                                    </div>

                                    <div className = { styles.vision}>
                                        <span className = { styles.txtTitle }>Vision</span>
                                        <textarea
                                            className = { styles.txtSubTitle } 
                                            placeholder = "Place information here..."
                                            name="vision"
                                            value={aboutUsData.vision}
                                            onChange={handleChangeDetails}
                                        />
                                    </div>

                                    <div className = { styles.mission}>
                                        <span className = { styles.txtTitle }>Mission</span>
                                        <textarea
                                            className = { styles.txtSubTitle } 
                                            placeholder = "Place information here..."
                                            name="mission"
                                            value={aboutUsData.mission}
                                            onChange={handleChangeDetails}
                                        />
                                    </div>

                                    <div className = { styles.goal}>
                                        <span className = { styles.txtTitle }>Goal</span>
                                        <textarea
                                            className = { styles.txtSubTitle } 
                                            placeholder = "Place information here..."
                                            name="goal"
                                            value={aboutUsData.goal}
                                            onChange={handleChangeDetails}
                                        />
                                    </div>

                                    <div className = { styles.objective}>
                                        <span className = { styles.txtTitle }>Objectives</span>
                                        <textarea
                                            className = { styles.txtSubTitle } 
                                            placeholder = "Place information here..."
                                            name="objectives"
                                            value={aboutUsData.objectives}
                                            onChange={handleChangeDetails}
                                        />
                                    </div>
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
                            <span className = { styles.txtTitle } onClick = {() => { handleUpdateImage(aboutUsData.image); handleSaveDetails(); }}>Save Changes</span>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {/* Delete Modal */}
                {deleteModalVisible && (
                    <motion.div 
                        className={styles.confirmDltContainer}
                        id = "aboutUsEdit"
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1}}
                        exit = {{opacity: 0}}
                        transition = {{duration: 0.2, ease: "easeInOut"}}
                    >
                        <Confirmation 
                            setConfirmDelete = { confirmAndDelete }
                            onCancel = { cancelBtn }
                        />
                   </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

