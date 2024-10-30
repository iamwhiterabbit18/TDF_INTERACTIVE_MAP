
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import styles from './Popup.module.scss';
import icon from '../../../../../../assets/Icon.js';  
import icons from '../../../../../../assets/for_landingPage/Icons.jsx';
import images from '../../../../../../assets/for_landingPage/Images.jsx';
import Time from './Time.jsx';
import Modal from "./modal/Modal.jsx";
import axios from 'axios';

function Popup({ modalId ,marker, onClose, isAdmin=true }) {
  console.log('Popup modalId:', modalId); // Check the received modalId
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
 /* const [isOpen, setIsOpen] = useState(false);
  const onViewFullDetail = (data) =>{
    setIsOpen(!isOpen);
  }
  const onCloseModal = () =>{
    setIsOpen(false);
  } */

  const onViewFullDetail = async () => {
    console.log('Modal ID:', modalId); // Debugging log
    if (!modalId) {
      console.error('No modal ID provided');
      return;
    }
    
    console.log('Fetching URL:', `http://localhost:5000/api/modal/${modalId}`); // Log the full URL

    try {
      const response = await axios.get(`http://localhost:5000/api/modal/${modalId}`);
      setModalData(response.data);
      console.log('Modal Data:',response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching modal data:', error);
    }
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  //Allow the pop up modal to run exit animation before it unmounts
  const [isClosing, setIsClosing] = useState(false);

  const onCloseWithDelay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
  }, 200);
};

  return (
    <>
    <AnimatePresence mode="wait">
      {!isClosing && marker && (
        <motion.div
          id="popup"
          className={styles.popupContent}
          style={{ position: "absolute", zIndex: 100 }}
          initial = {{opacity: 0}}
          animate = {{opacity: 1}}
          exit = {{opacity: 0}}
          transition = {{duration: 0.2, ease: "easeInOut"}}
        >
          { /*
            isAdmin && <a href="/administrator">Edit</a>
          */}
          <div className={styles.closeBtn} onClick={onCloseWithDelay}>
              <button>
                  <img src={icons.close} alt="close" />
              </button>
          </div>

          <div className={styles.popupImage}>
              <img src={images.image1} alt={marker.name}/> {/* tempoorary replace the marker.img for visualization */}
          </div>

          <div className={styles.cont1}>
            <div className={styles.btns}>
              <button>
                <img className = { `${styles.icon} ${styles.location}` } src={icons.location} alt="wayfind" />
              </button>
              <button>
                <img className = { `${styles.icon} ${styles.audio}` } src={icons.audio} alt="speaker" />
              </button>
            </div>

            <span className = {styles.txtTitle} >{marker.name}</span>

            <div className = { styles.line }></div>

            <p className = { styles.quickFacts } >{marker.quickFacts}</p>

            <div className={styles.fullDeets}>
              <button className={styles.deets} onClick={onViewFullDetail}>
                <p>View Full Details &nbsp; {'>'}</p>
              </button>
            </div>
          </div>

        </motion.div>
      )}
        {isOpen && modalData && <Modal modalId={modalId} modalData={modalData} onClose={onCloseModal} />}

        { /*
          isOpen && <Modal details={marker} onClose={onCloseModal} />
          */}
    </AnimatePresence>
    </>
  )
}

export default Popup