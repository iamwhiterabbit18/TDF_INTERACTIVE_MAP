import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './styles/AudioManagement.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import AudioUpload from './AudioUpload';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component

import UseToast from '../utility/AlertComponent/UseToast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import icons from "../../../assets/for_landingPage/Icons";
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from './navBar/NavBar';
import Confirmation from '../utility/ConfirmationComponent/Confirmation';

const AudioManagement = () => {
  // toast alert pop up
  const mountToast = UseToast();

  const location = useLocation();
  const user = location.state?.user;
  
  const [audios, setAudios] = useState([]);
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is currently playing
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null); // Ref for controlling the audio element

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(false); // Confirmation Modal 
  const [audioToDelete, setAudioToDelete] = useState(null);

  const handleDeleteBtn = (audioId) => {
      setAudioToDelete(audioId);
      setIsDelete(!isDelete);
  }

  const confirmAndDelete = () => {
      setConfirmDelete(true);
  }

  useEffect(() => {
    if (confirmDelete && audioToDelete) {
        handleDelete();
        setConfirmDelete(false);
    }
  }, [confirmDelete, audioToDelete]);

  const [modalProps, setModalProps] = useState({ audioId: null, currentTitle: '' });

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/audio');
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };

 

  const handlePlayAudio = async (filePath, audioId) => {
    // Stop currently playing audio if different
    if (playingAudioId && playingAudioId !== audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioId(null);
    }
  
    // If same audio is clicked again, stop it
    if (playingAudioId === audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudioId(null);
      return;
    }
  
    try {
      const response = await axios.get(`http://127.0.0.1:5000/${filePath}`, { responseType: 'blob' });
      
      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPlayingAudioId(audioId);
  
        // Play the audio file
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      mountToast("No Audio Available or Audio File dont exist!!", "error"); // Alert the user
    }
  };
  

  const handleDelete = async () => {
    try {
      if (confirmDelete && audioToDelete) {
        await axios.delete(`http://127.0.0.1:5000/api/audio/delete/${audioToDelete}`);
        fetchAudios(); // Refresh the audio list after deletion
        mountToast("Audio deleted successfully", "success");
        setConfirmDelete(false);
        setAudioToDelete(null);
        setIsDelete(false);
      }
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

   const handleOpenModal = (audioId = null, currentTitle = '') => {
    console.log("Opening modal with audioId:", audioId);
    setModalProps({ audioId, currentTitle });
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    fetchAudios(); // Refresh the audio list after upload/update
  };

  // importat. Related to CSS
  // Get the root ID and and apply className 
  useEffect(() => {
    const rootDiv = document.getElementById("root");

    // Add or remove className based on current page

    if (location.pathname === "/audio") {
      rootDiv.classList.add(styles.rootDiv);
    } else {
      rootDiv.classList.remove(styles.rootDiv);
    }
  }, [location])
  
 return (
  <>
    <NavBar />

    <div className={styles.audioManagementContainer}>

      <div className={styles.header}>
        <span className = { styles.txtTitle }>Audio Management</span>
      </div>

      <div className = { styles.tblWrapper }>
        <table className={styles.audioManagementTable}>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {audios.map((audio) => (
              <tr key={audio._id}>
                <td>
                  <button 
                    onClick={() => handlePlayAudio(audio.filePath, audio._id)}
                    className = { styles.playBtn }
                  >
                    <img className = { `${ styles.icon } ${ styles.play}` } src = { icons.audio } alt = "Play Audio" />
                  </button>
                </td>
                <td>{audio.title}</td>
                <td className = { styles.fileName }>{audio.originalName || 'No Audio Available'}</td>
                <td>
                  <div className = {styles.actionBtns }>
                    {audio.originalName ? (
                      <>
                        <button onClick={() => handleOpenModal(audio._id, audio.title)}>
                          <img className = { `${ styles.icon } ${ styles.delete}` } src = { icons.pencil } alt = "Delete Item" />
                        </button>
                        <button onClick={() => handleDeleteBtn(audio._id)}>
                          <img className = { `${ styles.icon } ${ styles.update }` } src = { icons.remove } alt = "Delete Item" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleOpenModal(audio._id, audio.title)}>
                        <img className = { `${ styles.icon } ${ styles.add}` } src = { icons.add } alt = "Add Audio"/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal for AudioUpload */}
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
            <AudioUpload
              audioId={modalProps.audioId} // Pass audioId
              currentTitle={modalProps.currentTitle} // Pass currentTitle
              onClose={handleCloseModal} // Pass the onClose function to close the modal
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
                setConfirmDelete = { confirmAndDelete }
            />
        </motion.div>
      )}
    </AnimatePresence>  
    
    {/* Audio player */}
    <audio ref={audioRef} hidden />
    
    <ToastContainer />
  </>
 )
}

export default AudioManagement;
