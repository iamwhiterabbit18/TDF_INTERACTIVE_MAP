import React, { useState } from 'react';
import styles from './AddMarker.module.scss';

const Modal = ({ isVisible, onSave, onClose }) => {
  const [siteName, setSiteName] = useState('');

  const handleSubmit = () => {
    if (siteName.trim()) {
      onSave(siteName);
      onClose();  // Close the modal after saving
      setSiteName('');
    } else {
      alert('Please enter a site name.');
    }
  };

  return (
    isVisible && (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <label htmlFor="siteName">Input the site's name:</label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
            <button onClick={handleSubmit}>Save</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
