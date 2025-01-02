import React, { useState } from 'react';
import styles from './AddMarker.module.scss';

import UseToast from '../../../../Admin/utility/AlertComponent/UseToast';

const Modal = ({ isVisible, onSave, onClose , worldPosition, icon, iconName }) => {
  // toast alert pop up
  const mountToast = UseToast();

  const [areaName, setAreaName] = useState('');

  const handleSubmit = async () => {
    if (!areaName.trim()) {
      mountToast("Please enter a site name!", "error");
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
        mountToast("Marker saved successfully!", "success");
        onSave(areaName); // Call onSave to update local state
        onClose(); // Close the modal
        setAreaName(''); // Reset the site name input
        window.location.reload();
      } else {
        mountToast(`Error: ${data.message || 'Something went wrong'}`, "error");
      }
    } catch (error) {
      console.error('Error saving marker:', error.message);
      mountToast("Server error. Could not save marker.", "error");
    }
  };
  
  const handleClose = () => {
    onClose();
    setAreaName(''); // Reset the input when modal is 
    // window.location.reload();
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
