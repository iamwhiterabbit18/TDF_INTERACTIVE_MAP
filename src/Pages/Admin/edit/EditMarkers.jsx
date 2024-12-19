import React, { useState, useEffect, useRef } from 'react';

import UseToast from '../utility/AlertComponent/UseToast';
import NavBar from './navBar/NavBar';
import Confirmation from '../utility/ConfirmationComponent/Confirmation';
import MarkerModal from './MarkerModal';
import axios from 'axios';
import styles from './styles/editMarkersStyles.module.scss'
import icons from "../../../assets/for_landingPage/Icons";
import { motion, AnimatePresence } from 'framer-motion'

//marker icon data
import markerData from '../../Users/map/Components/addMarker/markerData';

export default function EditMarkers() {
    // toast alert pop up
    const mountToast = UseToast();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isMarker, setIsMarker] = useState(null);
    const [isDelete, setIsDelete] = useState(false); // Confirmation Modal 
    const [markers, setMarkers] = useState([]); // State for fetched markers

    // icon delete
    const [isDeleteIcon, setIsDeleteIcon] = useState(false);

    const handleIconDelete = () => {
        setIsDeleteIcon(!isDeleteIcon);
    }
    
    const fetchMarkers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/markers/markerData');
          setMarkers(response.data);
        } catch (error) {
          console.error('Error fetching markers:', error);
          mountToast('Error fetching markers', 'error');
        }
      };
    
      useEffect(() => {
        fetchMarkers();
      }, []);
    

    const handleDeleteBtn = () => {
        setIsDelete(!isDelete);
    }

    const confirmAndDelete = () => {
        setConfirmDelete(true);
    }

    useEffect(() => {
        if (confirmDelete && isMarker) {
            handleConfirmDelete(isMarker); 
            setConfirmDelete(false);
        }
      }, [confirmDelete, isMarker]);
    
    const handleConfirmDelete = async (markerId) => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/markers/${markerId}`);
          setMarkers(markers.filter(marker => marker._id !== confirmDelete)); // Remove the deleted marker from the list
          mountToast('Marker and related documents deleted successfully', 'success');
          setIsDelete(false);
          setConfirmDelete(false);
          fetchMarkers();
        } catch (error) {
          console.error('Error deleting marker:', error);
          mountToast('Error deleting marker', 'error');
          setIsDelete(false);
        }
    };
      
    const handleOpenModal = (marker) => {
        setShowUploadModal(true);
        setSelectedMarker(marker);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
        fetchMarkers();
    };

    const [selectedMarker, setSelectedMarker] = useState(null);
    const handleUpdate = (updatedMarker) => {
        // Logic to update markers in the parent state or refetch them
        console.log('Updated Marker:', updatedMarker);
        handleCloseModal();
    };

    useEffect(() => {
        const rootDiv = document.getElementById("root");
    
        // Add or remove className based on current page
    
        if (location.pathname === "/markers") {
          rootDiv.classList.add(styles.rootDiv);
        } else {
          rootDiv.classList.remove(styles.rootDiv);
        }
      }, [location])

      return (
        <>
            <NavBar />

            <div className={styles.markerContainer}>
                <div className={styles.header}>
                    <span className={styles.txtTitle}>Edit Markers</span>
                </div>

                <span className={`${styles.txtTitle} ${styles.listHeader}`}>Marker Icon List</span>

                <div className = { styles.listCont }>
                    <div className = { styles.btns }>
                        <button 
                            className = { `${styles.txtTitle} ${styles.addBtn}`}
                        >
                            Add
                            <input
                                type="file"
                                accept="image/"
                                // ref={fileInputRef}
                                // id={`image-upload-${card._id}`}
                                // onChange={(e) => handleImageUpload(e, card._id)}
                            />
                        </button>
                        <button 
                            className = { !isDeleteIcon ? `${styles.txtTitle} ${styles.deleteBtn}` : `${styles.txtTitle} ${styles.cancelBtn}` }
                            onClick = { handleIconDelete }
                        >
                            { !isDeleteIcon ? "Delete" : "Cancel" }
                        </button>
                    </div>
                    
                    <div className = { styles.iconList }>
                        {markerData.map((data, index) => (
                            <div 
                                key = { index }
                                className = { styles.marker }
                            >
                                <img src = { data.icon } alt = { data.name } />
                                {isDeleteIcon && (
                                    <div 
                                        className = { styles.minusOverlay }
                                        onClick = {() => console.log(`Item Deleted ${data.name}`)} //onclick is for checking only, will be replaced
                                    >
                                        <img src={icons.minus} alt="Delete Icon" />
                                    </div>
                                )}
                            </div>

                            
                        ))}
                    </div>
                </div>

                <span className={`${styles.txtTitle} ${styles.listHeader}`}>Marker List</span>

                <div className={styles.tblWrapper}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Icon Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markers.length > 0 ? (
                                markers.map((marker) => (
                                    <tr key={marker._id}>
                                        <td>{marker.areaName}</td>
                                        <td>{marker.iconType}</td>
                                        <td>
                                            <div className={styles.actionBtns}>
                                                <button onClick={() => { handleOpenModal(marker); }}>
                                                    <img
                                                        className={`${styles.icon} ${styles.update}`}
                                                        src={icons.pencil}
                                                        alt="Update Item"
                                                    />
                                                </button>
                                                <button onClick={() => {handleDeleteBtn(); setIsMarker(marker._id);}}>
                                                    <img
                                                        className={`${styles.icon} ${styles.delete}`}
                                                        src={icons.remove}
                                                        alt="Delete Item"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No markers available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Marker Container */}
            <AnimatePresence>
            {showUploadModal && (
                <motion.div 
                    className={styles.modal}
                    initial = {{opacity: 0}}
                    animate = {{opacity: 1}}
                    exit = {{opacity: 0}}
                    transition = {{duration: 0.2, ease: "easeInOut"}}   
                >
                <div className={styles.modalContent}>
                    <MarkerModal 
                        onClose={ handleCloseModal }
                        markerData={selectedMarker}
                        onUpdate={handleUpdate}
                    />
                </div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <AnimatePresence>
            {isDelete && (
                <motion.div 
                    className = { styles.confirmation }
                    initial = {{opacity: 0}}
                    animate = {{opacity: 1}}
                    exit = {{opacity: 0}}
                    transition = {{duration: 0.2, ease: "easeInOut"}}
                >
                    <Confirmation 
                        onCancel = {() => handleDeleteBtn()}
                        setConfirmDelete={ confirmAndDelete }
                    />
                </motion.div>
            )}
            </AnimatePresence>  
        </>
    )
}