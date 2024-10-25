import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AudioUpload.module.scss';

const AudioUpload = ({ audioId, currentTitle, onClose }) => {
  const [title, setTitle] = useState(currentTitle || ''); // Title of the audio
  const [audioFile, setAudioFile] = useState(null); // Selected audio file
  const [message, setMessage] = useState(''); // Error or informational messages

  // Handler for file input change
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]); // Set the selected file
  };

  // Handler for updating existing audio record
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!audioId) return; // No action if there's no audio ID
    if (!audioFile) {
      alert("Please select an audio file to upload."); // Alert if no file is selected
      return; // Stop execution if no file is selected
    }

    const formData = new FormData();
    formData.append('title', title);
    if (audioFile) formData.append('audio', audioFile);

    try {
      await axios.put(`http://localhost:5000/api/audio/update/${audioId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Audio updated successfully');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating audio:', error);
      setMessage('Error updating audio, please try again.'); // Show error message
    }
  };

  // Handler to close the modal
  const handleClose = () => {
    setTitle(''); // Reset title
    setAudioFile(null); // Clear file selection
    setMessage(''); // Clear messages
    onClose(); // Trigger the onClose function to close the modal
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={handleClose}>
          &times;
        </span>

        <div className={styles.formContainer}>
          <h1>Upload Audio File</h1>
          
          <label>Audio Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter audio title"
            required
            disabled
          />
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="audio/*" 
            required 
          />
          <button type="submit" onClick={handleUpdate}>
            Upload
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>

        {message && <p>{message}</p>} {/* Display message if exists */}
      </div>
    </div>
  );
  
};

export default AudioUpload;
