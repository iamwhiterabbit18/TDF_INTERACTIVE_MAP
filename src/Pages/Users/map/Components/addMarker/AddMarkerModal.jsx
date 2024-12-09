import React, { useState } from 'react';
import styles from './AddMarker.module.scss';

const Modal = ({ isVisible, onSave, onClose , worldPosition, icon, iconName }) => {
  const [areaName, setAreaName] = useState('');

  const handleSubmit = async () => {
    if (!areaName.trim()) {
      alert('Please enter a site name.');
      return;
    }

    const markerData = {
      areaName,
      worldPosition,
      iconType: iconName,
    };

    try {
      const response = await fetch('http://localhost:5000/api/markers/addMarker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(markerData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Marker saved successfully!');
        onSave(areaName); // Call onSave to update local state
        onClose(); // Close the modal
        setAreaName(''); // Reset the site name input
      } else {
        alert(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error saving marker:', error.message);
      alert('Server error. Could not save marker.');
    }
  };
  const handleClose = () => {
    onClose();
    setAreaName(''); // Reset the input when modal is closed
  };

  return (
    isVisible && (
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* Display positions */}
            <h2>Marker Details</h2>
             <div className={styles.positionInfo}>
             <span>Icon: {iconName} </span>
            </div>
            <div className={styles.icon}>
              <img src={icon} alt="Marker Icon" />
            </div>
            <label htmlFor="areaName">Input the site's name:</label>
            <input
              id="areaName"
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="Enter site name"
            />
            <div className={styles.modalButtons}>
              <button onClick={handleSubmit}>Save</button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
