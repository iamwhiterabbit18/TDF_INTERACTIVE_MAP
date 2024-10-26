import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ArrowIcon from '../../../assets/actions/Arrow_icon.png';
import styles from '/src/Pages/Admin/edit/styles/ModalsEdit.module.scss'; // Ensure you have proper CSS

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
  const [isLoading, setIsLoading] = useState(true); // Add for Pagination and UX
  const [isOpen, setIsOpen] = useState(false); // Control modal visibility

  const [uploadModalVisible, setUploadModalVisible] = useState(false); // Toggle for upload modal
  const [uploadImagePreviews, setUploadImagePreviews] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // Toggle for delete modal
  const [updateImageIndex, setUpdateImageIndex] = useState('');
  const [updatePreviewImages, setUpdatePreviewImages] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Toggle for delete modal
  const [deleteFile, setDeleteFile] = useState('');
  
  // Fetch all modals on component mount
useEffect(() => {
  const fetchModals = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get('http://localhost:5000/api/modal');
      setModals(response.data);
    } catch (error) {
      console.error('Error fetching modals:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };
  fetchModals();
}, []);
    
// Fetch the latest Data from DB using ID, Updates preview whenever action made.
const fetchModalData = async () => {
  if (currentModal) {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:5000/api/modal/${currentModal._id}`);
      
      // Set modalImages state with the fetched images
      const fetchedImages = response.data.modalImages;

      // Update modalImages state
      setModalImages(fetchedImages);

      // Update currentModal with latest data
      setCurrentModal(response.data);

      // Update image previews based on the fetched images
      const imagePreviews = fetchedImages
        ? fetchedImages.map((img) => `http://localhost:5000/uploads/modalImages/${img}`)
        : [];
      
      setModalImagePreviews(imagePreviews);
    } catch (error) {
      console.error('Error fetching modal images:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  }
};

// Fetch individual modal data for real-time updates
useEffect(() => {
  if (isOpen) { // Only fetch if the modal is open
    //if (isOpen && currentModal) { // not sure if works
    fetchModalData(); // Call it when currentModal changes
  }
}, [isOpen]);

const handleEditClick = (modal) => {
  setCurrentModal(modal);
  setIsOpen(true); // Open the modal
  setDescription(modal.description);

  // Optionally fetch the latest modal data (can be removed since useEffect handles it)
  fetchModalData();
};

// Function to handle the close modal action
const closeModal = () => {
  setIsOpen(false); // Close the modal
  setCurrentModal(null); // Clear modal data
};

const cancelBtn = () => {
  setUploadModalVisible(false);
  setUpdateModalVisible(false);
  setDeleteModalVisible(false);
  setUploadImagePreviews([]); // Clear the image previews
  setUpdatePreviewImages([]);
  
  // Optionally, clear modalImages if you don't need them after canceling
  // setModalImages([]);
};


{/*  OLD Handle file changes (not in use)
const handleModalFileChange = (e) => {
  const fileArray = Array.from(e.target.files);
  const imageUrls = fileArray.map((file) => URL.createObjectURL(file)); // Create URLs for previews
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  // Check for unsupported files
  const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

  if (unsupportedFiles.length > 0) {
    alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
    return; // Remove the page reload to improve user experience
  }

  // Check if selected files are within the range
   //if (fileArray.length < 3 || fileArray.length > 5) {
   //alert('Please upload between 3 to 5 images.');
  //return; // Remove the page reload to improve user experience
   //}  

  // Update state with valid files and their preview URLs
  setModalImages(fileArray); // Store actual files for submission
  setUploadImagePreviews(imageUrls); // Generate preview URLs
  setUpdatePreviewImages(imageUrls); // Update state with preview URLs
}; */}

const handleUploadFileChange = (e) => {
  const fileArray = Array.from(e.target.files);
  const imageUrls = fileArray.map((file) => URL.createObjectURL(file)); // Create URLs for previews
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

  if (unsupportedFiles.length > 0) {
    alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
    return;
  }

  setModalImages(fileArray); // Store actual files for submission
  setUploadImagePreviews(imageUrls); // Generate preview URLs for uploading
};


    // Handle the upload of new images
    const handleUpload = async () => {
      if (!currentModal) {
        alert('No modal selected for uploading images.');
        return;
      }
    
      try {
        const formData = new FormData();
        modalImages.forEach((image) => {
          formData.append('modalImages', image); // Append each image with the key 'modalImages'
        });
    
        const response = await axios.post(`http://localhost:5000/api/modal/${currentModal._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response:', response);
        if (response.status === 200) {
          alert('Images uploaded successfully!');
          console.log('Images uploaded successfully!');
          fetchModalData(); // Fetch updated modal data
          setUploadImagePreviews([]);
          setUploadModalVisible(null); 
          return;
        } else {
          console.error('Unexpected status:', response.status);
          alert('Failed to upload images.');
        }
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error uploading images. Please try again.');
      }
    };
    
    const handleUpdateFileChange = (e) => {
      const fileArray = Array.from(e.target.files);
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file)); // Create URLs for previews
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
      const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));
    
      if (unsupportedFiles.length > 0) {
        alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
        return;
      }
    
      setModalImages(fileArray); // Store actual files for submission
      setUpdatePreviewImages(imageUrls); // Generate preview URLs for updating
    };
    

  const handleUpdate = async () => {
    if (!currentModal || updateImageIndex === null) {
      alert('No modal or image index selected for updating.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', originalModalImages.title); // Keep the fixed title
      formData.append('description', description); // Update the description
  
      // Append only the new image for the specific index
      if (modalImages[0]) {
        formData.append('modalImage', modalImages[0]); // Upload the new image
        formData.append('imageIndex', updateImageIndex); // Pass the index of the image to replace
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/modal/${currentModal._id}/updateImage`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 200) {
        alert('Image updated successfully!');
        console.log('Images updated successfully!');
        fetchModalData(); // Fetch updated modal data
        setUpdateModalVisible(null);
        setUpdatePreviewImages([]);
        return;
      } else {
        throw new Error('Failed to update the image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating the image. Please try again.');
    }
  };


// Handle the deletion of specific images
const handleDelete = async (filename) => {
  if (!currentModal) {
    alert('No modal selected for deleting images.');
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:5000/api/modal/uploads/modalImages/${filename}`, {
      data: {
        id: currentModal._id, // Pass the modal ID
      },
    });

    if (response.status === 200) {
      alert('Image deleted successfully!');
      
      // Re-fetch modal data to get the updated list of images
      fetchModalData(); // Ensure this function properly updates currentModal and modalImages

      // Optionally clear any modal state
      setDeleteModalVisible(null);
    } else {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    alert('Error deleting image. Please try again.');
  }
};
  
  
  const navigate = useNavigate();
  const handleBackClick  = () => {
    navigate(`/map`); // Navigate to the specific card display page
  };
  
  //Settings of Slick Carousel
  const settings = {
    dots: false,
    infinite: false,
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
  
      {isLoading ? (
        <div>Loading...</div>  /* Show loading message when data is being fetched */
      ) : (
        
        <div className={styles.modalsList}>
          {modals.length > 0 ? (
            modals.map((modal) => (
              <div key={modal._id}>
                <h3>{modal.title}</h3>
                <button onClick={() => handleEditClick(modal)}>Edit</button>
              </div>
            ))
          ) : (
            <p>No modals available</p>  /* Fallback when no modals are fetched */
          )}
        </div>
      )}
  
      {currentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalEditingSection}>
            <label>
              Edit Modal:
              <h2>{currentModal.title}</h2>
            </label>
          
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
              <button className={styles.saveBtn} type="button" onClick={() => setUploadModalVisible(true)}>Add Image</button> 
              <h2>Modal Images:</h2>
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
                        <button
                          className={styles.saveBtn}
                          type="button"
                          onClick={() => {
                            setUpdateModalVisible(true);
                            setUpdateImageIndex(index); // Store the index of the image to update
                          }}
                        >
                          Update Image
                        </button>
                        <button
                          className={styles.closeBtn}
                          onClick={() => {
                            setDeleteFile(currentModal.modalImages[index]); // Set the filename to delete
                            setDeleteModalVisible(true); // Open delete modal
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}

            {/* Update Modal */}
            {updateModalVisible && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.imageUploadContainer}>
                      <h3>Update Image:</h3>
                      <input
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleUpdateFileChange}
                      />
                      <div className={styles.updatePreview}>
                        {updatePreviewImages.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Preview ${index}`}
                            className={styles.previewImage}
                          />
                        ))}
                      </div>
                      <button type="button" className={styles.saveBtn} onClick={handleUpdate}>
                        Upload
                      </button>
                      <button type="button" className={styles.closeBtn} onClick={cancelBtn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Modal */}
              {uploadModalVisible && (
                    <div className={styles.modalOverlay}>
                      <div className={styles.modalContent}>
                        <div className={styles.imageUploadContainer}>
                          <h3>Upload New Images</h3>
                          <input 
                            type="file" 
                            accept="image/jpeg, image/jpg, image/png" 
                            multiple 
                            onChange={handleUploadFileChange} 
                          />

                          {/* Image Carousel for Preview */}
                          <h2>Preview Image:</h2>
                            <div className={styles.imageCarousel}>
                              <Slider {...settings}>
                                {uploadImagePreviews.map((image, index) => (
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
                          
                    <button type="button" className={styles.saveBtn} onClick={handleUpload}>Upload</button>
                    <button type="button" className={styles.closeBtn} onClick={cancelBtn}>Cancel</button>
                  </div>
                </div>
                </div>
              )}

              {/* Delete Modal */}
              {deleteModalVisible && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this image?</p>
                    <button type="button" className={styles.closeBtn} onClick={() => handleDelete(deleteFile)}>Yes, Delete</button>
                    <button type="button" className={styles.saveBtn} onClick={cancelBtn}>Cancel</button>
                  </div>
                </div>
              )}
                    
  
            {/* <button className={styles.saveBtn} type="submit">Save</button>*/}
              <button className={styles.closeBtn} type="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
  
      {/* Button container for absolute positioning */}
      <div className={styles.accessBtnContainer}>
        <AccessBtn user={user} />  {/* Pass user as prop if needed */}
      </div>
    </div>
  );
  
};

export default Modal;
