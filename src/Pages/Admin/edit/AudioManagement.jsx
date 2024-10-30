import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './styles/AudioManagement.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import AudioUpload from './AudioUpload';

import icons from "../../../assets/for_landingPage/Icons";
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from './navBar/NavBar';
import Confirmation from '../utility/ConfirmationComponent/Confirmation';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component
import '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';

const AudioManagement = () => {
  const location = useLocation();
  const user = location.state?.user;
  
  const [audios, setAudios] = useState([]);
  const [assignedTo, setAssignedTo] = useState(''); // 'onload' or 'onclick'
  const [playingAudioId, setPlayingAudioId] = useState(null); // Track which audio is currently playing
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null); // Ref for controlling the audio element

  const [modalProps, setModalProps] = useState({ audioId: null, currentTitle: '' });

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audio');
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };

  const handleOpenModal = (audioId = null, currentTitle = '') => {
    console.log("Opening modal with audioId:", audioId);
    setModalProps({ audioId, currentTitle });
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    fetchAudios(); // Refresh the audio list after upload
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
      const response = await axios.get(`http://localhost:5000/${filePath}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPlayingAudioId(audioId);

      // Play the audio file
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleDelete = async (audioId) => {
    if (window.confirm('Are you sure you want to delete this audio?')) {
      try {
        await axios.delete(`http://localhost:5000/api/audio/delete/${audioId}`);
        fetchAudios(); // Refresh the audio list after deletion
        alert('Audio deleted successfully');
      } catch (error) {
        console.error('Error deleting audio:', error);
      }
    }
  };

  const handleUpdate = async (audioId) => {
    const newTitle = prompt('Enter new title for the audio:');
    if (newTitle) {
      try {
        await axios.put(`http://localhost:5000/api/audio/update/${audioId}`, { title: newTitle });
        fetchAudios(); // Refresh the audio list after updating
        alert('Audio updated successfully');
      } catch (error) {
        console.error('Error updating audio:', error);
      }
    }
  };

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

  // Confirmation Modal
  const [isDelete, setIsDelete] = useState(false);

  function handleDeleteBtn() {
      setIsDelete (!isDelete);
  }

  return (
    <>
      <NavBar />
      
      <div className={styles.audioManagementContainer}>

        <div className={styles.header}>
          <span className = { styles.txtTitle }>Audio Management</span>
        </div>

        <div className = { styles.tblWrapper}>
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
                  <td>{audio.originalName || "No Audio Available"}</td>
                  <td>
                    <div className = { styles.actionBtns }>
                      <button>
                        <img onClick = { handleOpenModal } className = { `${ styles.icon } ${ styles.pencil}` } src = { icons.pencil } alt = "Edit Item" />
                      </button>
                      {audio.originalName && (
                        <button onClick={ handleDeleteBtn }>
                          <img className = { `${ styles.icon } ${ styles.delete}` } src = { icons.remove } alt = "Delete Item" />
                        </button>
                      )}
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audio player */}
        <audio ref={audioRef} hidden />
      </div>

      {/* Modal for AudioUpload */}
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
                onClose={handleCloseModal} 
                onSave = { handleUpdate }
              />
            </div>
          </motion.div>
        )}
      
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
                    onDelete = {() => handleDelete(audio._id)} //NOTE
                />
            </motion.div>
          )}
        </AnimatePresence>  
    </>
  );
  
};

export default AudioManagement;
