import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ArrowIcon from '../../../assets/actions/Arrow_icon.png';
import styles from './styles/ModalsEdit.module.scss'; // Ensure you have proper CSS

import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component
import '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';

const Modal = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [modals, setModals] = useState([]); // Store all modals
  const [currentModal, setCurrentModal] = useState(null); // Store selected modal for editing
  const [description, setDescription] = useState('');
  const [originalModalImages, setOriginalModalImages] = useState([]); // To store original images
  const [modalImages, setModalImages] = useState([]);
  const [modalImagePreviews, setModalImagePreviews] = useState([]);

  // Fetch all modals on component mount
  useEffect(() => {
    const fetchModals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/modal');
        setModals(response.data); // Set the fetched modals
      } catch (error) {
        console.error('Error fetching modals:', error);
      }
    };
    fetchModals();
  }, []);

// Handle file changes
const handleModalFileChange = (e) => {
  const fileArray = Array.from(e.target.files);

  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  // Check for unsupported files
  const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

  if (unsupportedFiles.length > 0) {
    alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
    return; // Prevent the reload, just return
  }

  // Check if selected files are within the range
  if (fileArray.length < 3 || fileArray.length > 5) {
    alert('Please upload between 3 to 5 images.');
    return; // Prevent the reload, just return
  }

  // Update state with valid files and their preview URLs
  setModalImages(fileArray); // Store actual files for submission
  setModalImagePreviews(fileArray.map(file => URL.createObjectURL(file))); // Generate preview URLs

};
  // Function to handle the close modal action
  const closeModal = () => {
    setCurrentModal(null); // Close the modal by clearing the current modal
  };

  const handleEditClick = (modal) => {
    setCurrentModal(modal);
    setDescription(modal.description);

    // Fetch and set image previews
    const imagePreviews = modal.modalImages
      ? modal.modalImages.map((img) => `http://localhost:5000/uploads/modalImages/${img}`)
      : [];

    setModalImagePreviews(imagePreviews);
  };

// Working handle submit prevents saving if teheres no changes in desc. or images of Modal
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (!currentModal) {
      alert('No modal is currently selected for editing.');
      return;
    }
    const originalModal = currentModal; // Get the original modal data
    let changesMade = false; // Flag to track if any changes are made
  
    // Check if there are changes in the description
    const descriptionChanged = description !== originalModal.description;
  
    // Extract image names from the original image URLs
    const currentImageSet = modalImages.map(file => file.name); // Get the current file names
    const originalImageSet = originalModalImages; // Get the original image names

    // Check if any images have changed
    const imagesChanged = currentImageSet.length !== originalImageSet.length ||
                          currentImageSet.some((img, index) => img !== originalImageSet[index]);

    console.log("Original Image Set:", originalImageSet);
    console.log("Current Image Set:", currentImageSet);
    console.log("Changes made:", imagesChanged);
    
    // Set changesMade to true if any changes are detected
    if (descriptionChanged || imagesChanged) {
      changesMade = true;
    }
    // Show debug information
    console.log('Changes made:', changesMade);
    console.log('Description changed:', descriptionChanged);
    console.log('Images changed:', imagesChanged);
  
    if (changesMade) {
      try {
        const formData = new FormData();
        formData.append('title', originalModal.title); // Keep the fixed title
        formData.append('description', description); // Update the description
  
        // Append the new modal images to the FormData
        modalImages.forEach((image) => {
          if (image) {
            formData.append('modalImages', image); // Include each image file
          }
        });
        // Send the PUT request to update the modal data
        const response = await axios.put(`http://localhost:5000/api/modal/${currentModal._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          alert('Modal data saved successfully!');
          window.location.reload(); // Reload the page after successful save
        } else {
          throw new Error('Failed to update modal data');
        }
      } catch (error) {
        console.error('Error updating modal data:', error);
        alert('Error saving data. Please try again.');
      }
    } else {
      alert('No changes detected in modal data'); // Show message if no changes were detected
    }
  };
  
  const navigate = useNavigate();
  const handleBackClick  = () => {
    navigate(`/map`); // Navigate to the specific card display page
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
<div className={styles.modalContainer}>
  <div className={styles.Header}>
  <h1>All Modals</h1>
  <button className={styles.backButton} onClick={handleBackClick}>
           <img src={ArrowIcon} alt="Back" className={styles.icon} />
          </button>
  </div>
  <div className={styles.modalsList}>
    {modals.map((modal) => (
      <div key={modal._id}>
        <h3>{modal.title}</h3>
        <button onClick={() => handleEditClick(modal)}>Edit</button>
      </div>
    ))}
  </div>

  {currentModal && (
    <div className={styles.modalOverlay}>
      <div className={styles.modalEditingSection}>
        <label>
          Edit Modal:
          <h2>{currentModal.title}</h2>
        </label>
        <form onSubmit={handleSubmit}>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className={styles.imageUploadContainer}>
            <h3>Upload Images:</h3>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              multiple
              onChange={handleModalFileChange}
            />
          </div>

          {modalImagePreviews.length > 0 && (
            <div className={styles.imageCarousel}>
              <Slider {...settings}>
                {modalImagePreviews.map((image, index) => (
                  <div key={index} className="slick-slide">
                    <img
                      src={image}
                      alt={`Uploaded preview ${index}`}
                      className={styles.carouselImage}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}

              <button type="submit">Save</button>
              {/* Add a Close button to close the modal */}
              <button type="button" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
      {/* Button container for absolute positioning */}
      <div className={styles.accessBtnContainer}>
            <AccessBtn user={user} /> {/* Pass user as prop if needed */}
        </div>
    </div>
  );
};

export default Modal;
