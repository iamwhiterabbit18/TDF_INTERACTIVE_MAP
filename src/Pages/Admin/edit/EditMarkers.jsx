import React, { useState, useEffect, useRef } from 'react';

import UseToast from '../utility/AlertComponent/UseToast';
import NavBar from './navBar/NavBar';
import Confirmation from '../utility/ConfirmationComponent/Confirmation';
import MarkerModal from './MarkerModal';

import styles from './styles/editMarkersStyles.module.scss'
import icons from "../../../assets/for_landingPage/Icons";
import { motion, AnimatePresence } from 'framer-motion'

export default function EditMarkers() {
    // toast alert pop up
    const mountToast = UseToast();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDelete, setIsDelete] = useState(false); // Confirmation Modal 

    const handleDeleteBtn = () => {
        setIsDelete(!isDelete);
    }

    const handleOpenModal = () => {
        setShowUploadModal(true);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
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

            <div className = { styles.markerContainer }>
                <div className={styles.header}>
                    <span className = { styles.txtTitle }>Edit Markers</span>
                </div>

                <span className = { `${ styles.txtTitle} ${ styles.listHeader }` }>Marker List</span>

                <div className = { styles.tblWrapper }>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Icon Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Placeholder</td>
                                <td>Placeholder</td>
                                <td>
                                    <div className = { styles.actionBtns }>
                                        <button onClick = {() => { handleOpenModal(); }}>
                                            <img className = { `${ styles.icon } ${ styles.update}` } src = { icons.pencil } alt = "Update Item" />
                                        </button>
                                        <button onClick = {() => { handleDeleteBtn(); }}>
                                            <img className = { `${ styles.icon } ${ styles.delete }` } src = { icons.remove } alt = "Delete Item" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
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
                    {/* <AudioUpload
                        audioId={modalProps.audioId} // Pass audioId
                        currentTitle={modalProps.currentTitle} // Pass currentTitle
                        onClose={handleCloseModal} // Pass the onClose function to close the modal  
                    /> */}
                    <MarkerModal 
                        onClose={ handleCloseModal }
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
                        // setConfirmDelete = { confirmAndDelete }
                    />
                </motion.div>
            )}
            </AnimatePresence>  
        </>
    )
}