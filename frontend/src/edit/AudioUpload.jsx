import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AudioUpload.module.scss';

const AudioUpload = ({ onClose }) => {
  const [title, setTitle] = useState(''); // For storing the title of the audio
  const [audioFile, setAudioFile] = useState(null); // For storing the selected audio file
  const [message, setMessage] = useState(''); // For error or informational messages
  const [showConfirmation, setShowConfirmation] = useState(false); // Controls the visibility of the replace confirmation dialog
  const [showSuccess, setShowSuccess] = useState(false); // Controls the visibility of the success message

  // Handler for file input change
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]); // Set the selected file to state
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if title and audio file are provided
    if (!title || !audioFile) {
      setMessage('Please provide a title and select an audio file.');
      return;
    }

    // Create a FormData object to send the title and file in the POST request
    const formData = new FormData();
    formData.append('title', title);
    formData.append('audio', audioFile);

    try {
      // Send a POST request to the server to upload the audio file
      const response = await axios.post('http://localhost:5000/api/audio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the server indicates that the audio file with the same title is being replaced
      if (response.data.replaced) {
        setShowConfirmation(true); // Show the replace confirmation dialog
      } else {
        setShowSuccess(true); // Show success message if no replacement occurred
      }
    } catch (error) {
      alert('Error uploading audio. Only audio files (mp3, wav, ogg, m4a, flac) are allowed!'); // Show error message if the upload fails
      window.location.reload(); // Reload the page
      return;
    }
  };

  // Handler to confirm the replacement of an existing audio file
  const handleConfirmReplace = async () => {
    setShowConfirmation(false); // Close the confirmation dialog
    setShowSuccess(true); // Show success message after replacing the file
  };

  // Handler to close the modal (for both success or cancel actions)
  const handleClose = () => {
    onClose(); // Trigger the onClose function passed as a prop to close the upload form/modal
  };

  return (
    <div className={styles.modalOverlay}> {/* Overlay to cover the screen */}
      <div className={styles.modalContent}> {/* Modal content container */}
        <span className={styles.closeButton} onClick={handleClose}>
          &times; {/* Close button */}
        </span>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h1>Upload Audio File</h1>
          <label>Audio Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update the title state when the input changes
            placeholder="Enter audio title" required
          />
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Upload</button>
          <button type="button" onClick={handleClose}>Cancel</button>
        </form>

        {message && <p>{message}</p>}

        {showConfirmation && (
          <div className={styles.confirmationContainer}>
            <p>An audio file named "{title}" already exists. Do you wish to replace it?</p>
            <button onClick={handleConfirmReplace}>Continue</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        )}

        {showSuccess && (
          <div className={styles.messageContainer}>
            <p>File uploaded successfully: {title}</p>
            <button onClick={handleClose}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUpload;
