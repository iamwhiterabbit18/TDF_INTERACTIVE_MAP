import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AudioUpload.module.scss';

const AudioUpload = ({ audioId, currentTitle, onClose }) => {
  const [title, setTitle] = useState(''); // Title of the audio
  const [audioFile, setAudioFile] = useState(null); // Selected audio file
  const [message, setMessage] = useState(''); // Error or informational messages
  const [showSuccess, setShowSuccess] = useState(false); // Controls the success message visibility

  // Handler for file input change
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || (!audioFile && !audioId)) {
      setMessage('Please provide a title and select an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (audioFile) formData.append('audio', audioFile);

    try {
      if (audioId) {
        // Update existing audio record
        await axios.put(`http://localhost:5000/api/audio/update/${audioId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Audio updated successfully');
      } else {
        // Handle new audio upload logic if needed
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating audio:', error);
    }
  };

  // Handler to close the modal
  const handleClose = () => {
    onClose(); // Trigger the onClose function to close the modal
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={handleClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h1>Update Audio File</h1>
          <label>Audio Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter audio title"
          />
          <input type="file" onChange={handleFileChange} accept="audio/*" required/>
          <button type="submit">Update</button>
          <button type="button" onClick={handleClose}>Cancel</button>
        </form>

        {message && <p>{message}</p>}

        {showSuccess && (
          <div className={styles.messageContainer}>
            <p>Audio updated successfully: {title}</p>
            <button onClick={handleClose}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUpload;
