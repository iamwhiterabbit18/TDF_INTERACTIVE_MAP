import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/AudioUpload.module.scss';
import icons from "../../../assets/for_landingPage/Icons";

const AudioUpload = ({ onClose }) => {
  const [title, setTitle] = useState(''); // For storing the title of the audio
  const [audioFile, setAudioFile] = useState(null); // For storing the selected audio file
  const [message, setMessage] = useState(''); // For error or informational messages
  const [showConfirmation, setShowConfirmation] = useState(false); // Controls the visibility of the replace confirmation dialog
  const [showSuccess, setShowSuccess] = useState(false); // Controls the visibility of the success message

  // Handler for file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Set the selected file to state
    if (file) {
      setAudioFile(file.name);
    } else {
      setAudioFile("");
    }
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
    <div className={styles.modalContent}> {/* Modal content container */}
      <button className = { styles.close } onClick = { onClose }>
          <img src={icons.close} alt="close" />
      </button>
      <div className = { styles.header }>
        <span className = { styles.txtTitle }>
          UPLOAD AUDIO FILE
        </span>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className = { styles.customLabel }>
          {/* Just a visual representation of the input tag */}
          <button className = { styles.browseBtn }>Browse...</button>
          <span className = { styles.fileName }>
            { audioFile || "No file selected" }
          </span>
          {/* Hidden */}
          <input 
            className = { styles.input }
            type="file" 
            onChange={handleFileChange} 
            required 
          />
        </label>
        
        <div className = { styles.btns }>
          <button 
            className = { `${styles.saveBtn} ${styles.txtTitle}` } 
            type="submit"
          >
            Save
          </button>
          <button 
            className = { `${styles.cancelBtn} ${styles.txtTitle}` } 
            type="button" 
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
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
  );
};

export default AudioUpload;
