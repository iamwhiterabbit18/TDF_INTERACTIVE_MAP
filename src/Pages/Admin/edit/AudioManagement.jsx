import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './styles/AudioManagement.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import AudioUpload from './AudioUpload';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component
import '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';

const AudioManagement = () => {
  const location = useLocation();
  const user = location.state?.user;
  
  const [audios, setAudios] = useState([]);
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
      alert("No Audio Available or Audio File dont exist!!"); // Alert the user
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

   const handleOpenModal = (audioId = null, currentTitle = '') => {
    console.log("Opening modal with audioId:", audioId);
    setModalProps({ audioId, currentTitle });
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    fetchAudios(); // Refresh the audio list after upload/update
  };
  
 return (
    <div className={styles.audioManagementContainer}>
      <div className={styles.tableHeader}>
        <h1>Audio Management</h1>
        <button className={styles.navigateButton} onClick={() => navigate('/map')}>
           Go to Admin Page
        </button>
      </div>

      <table className={styles.audioManagementTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>File Name</th>
            <th>Play Audio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audios.map((audio) => (
            <tr key={audio._id}>
              <td>{audio.title}</td>
              <td>{audio.originalName || 'No Audio Available'}</td>
              <td>
                <button onClick={() => handlePlayAudio(audio.filePath, audio._id)}>Play</button>
              </td>
              <td>
                {audio.originalName ? (
                  <>
                    <button onClick={() => handleOpenModal(audio._id, audio.title)}>Update</button>
                    <button onClick={() => handleDelete(audio._id)}>Delete</button>
                  </>
                ) : (
                  <button onClick={() => handleOpenModal(audio._id, audio.title)}>Add Audio</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for AudioUpload */}
      {showUploadModal && (
        <AudioUpload
          audioId={modalProps.audioId} // Pass audioId
          currentTitle={modalProps.currentTitle} // Pass currentTitle
          onClose={handleCloseModal} // Pass the onClose function to close the modal
        />
      )}
      
      {/* Button container for absolute positioning */}
      <div className={styles.accessBtnContainer}>
        <AccessBtn user={user} /> {/* Pass user as prop if needed */}
      </div>
      
      {/* Audio player */}
      <audio ref={audioRef} hidden />
    </div>
  );
};

export default AudioManagement;
