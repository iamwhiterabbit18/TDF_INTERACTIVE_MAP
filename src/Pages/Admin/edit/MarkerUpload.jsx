import { useState, useEffect  } from 'react';
import UseToast from '../utility/AlertComponent/UseToast'; // For alerts
import icons from "../../../assets/for_landingPage/Icons";
import axios from 'axios';

import styles from "./styles/markerUploadStyles.module.scss";

export default function MarkerUpload({ markerId ,setmarkerId, onClose, onRefresh  }) {
  const [file, setFile] = useState(null); // Store selected file
  const [fileName, setFileName] = useState('No File Selected...');
  const [preview, setPreview] = useState(null); // For image preview
  const [name, setName] = useState(''); // Marker name
  const [currentImage, setCurrentImage] = useState(null); // Current markerIconimage
  //const [currentName, setCurrentImage] = useState(null); // Current markerIcon Name

  const  notify  = UseToast();

      // Fetch marker details when markerId changes
      useEffect(() => {
        const fetchMarkerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/markerIcons/${markerId}`);
                const { name: fetchedName, iconPath } = response.data;
                setName(fetchedName); // Set the current name
                setCurrentImage(`http://localhost:5000/uploads/icons/${iconPath}`); // Set the current image
            } catch (error) {
                console.error("Error fetching marker details:", error);
            }
        };

        if (markerId) fetchMarkerDetails();
    }, [markerId]);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setPreview(URL.createObjectURL(selectedFile)); // Generate preview URL
    } else {
      setFile(null);
      setFileName('No File Selected...');
      setPreview(null);
    }
  };

  const handleSave = async () => {
    if (!name || !file) {
      notify('Please provide all required fields.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('icon', file);

    try {
      const url = markerId 
        ? `http://localhost:5000/api/markerIcons/Icon/${markerId}` // Update route
        : 'http://localhost:5000/api/markerIcons/Icon'; // Add route

      const method = markerId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        notify(markerId ? 'Marker icon updated successfully!' : 'Marker icon created successfully!', 'success');
        onRefresh();
        onClose(); // Close modal after success
      } else {
        notify(result.error || 'Error saving marker icon.', 'error');
      }
    } catch (error) {
      console.error('Error saving marker icon:', error);
      alert('An unexpected error occurred.', 'error');
    }
  };
  

  return (
    <>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          <img src={icons.close} alt="close" />
        </span>

        <div className={styles.header}>
          <span className={styles.txtTitle}>
            UPLOAD MARKER ICON
          </span>
        </div>

        <div className={styles.form}>
          <div className={styles.editContent}>
            <label className={styles.customLabel}>
              <button className={styles.browseBtn}>Browse...</button>
              <span className={styles.fileName}>{fileName}</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/png"
                required
              />
            </label>

            <div className={styles.previewMarker}>
            {preview ? (
                        <img src={preview} alt="New Preview" />
                    ) : currentImage ? (
                        <img src={currentImage} alt="Current Marker" />
                    ) : (
                        <img src={icons.remove} alt="No Preview" />
                    )}
            </div>
          </div>

          <div className={styles.editContent}>
            <input
              type="text"
              placeholder="Enter Marker Icon Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.btns}>
            <button
                    className={`${styles.saveBtn} ${styles.txtTitle}`}
                    onClick={handleSave}
                >
                    Save
                </button>
            <button
              className={`${styles.cancelBtn} ${styles.txtTitle}`}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
