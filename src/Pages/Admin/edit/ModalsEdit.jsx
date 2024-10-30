import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ArrowIcon from '../../../assets/actions/Arrow_icon.png';
import styles from '/src/Pages/Admin/edit/styles/ModalsEdit.module.scss'; // Ensure you have proper CSS

import { motion, AnimatePresence } from 'framer-motion'
import images from '../../../assets/for_landingPage/Images';
import NavBar from './navBar/NavBar';
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
      try {
        const response = await axios.get('http://localhost:5000/api/modal');
        setModals(response.data); // Set the fetched modals
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

  const handleEditClick = (modal) => {
    setCurrentModal(modal);
    setIsOpen(true); // Open the modal
    setDescription(modal.description);

    // Optionally fetch the latest modal data (can be removed since useEffect handles it)
    fetchModalData();
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


  // Get the root ID and and apply className 
  useEffect(() => {
    const rootDiv = document.getElementById("root");

    // Add or remove className based on current page

    if (location.pathname === "/modal") {
      rootDiv.classList.add(styles.rootDiv);
    } else {
      rootDiv.classList.remove(styles.rootDiv);
    }
  }, [location])

  // resize textarea based on content
    const descriptionRef = useRef(null);
    const technologiesRef = useRef(null);
  
    const adjustHeight = (ref) => {
      if (ref && ref.current) {
        ref.current.style.height = 'auto'; // Reset height
        ref.current.style.height = `${ref.current.scrollHeight}px`; // Set height to scroll height
      }
    };

    // switch description or technologies
    const [isInfo, setIsInfo] = useState(false);

    const handleInfoBtn = () => {
      setIsInfo(!isInfo);
    }

    //for description
    useEffect(() => {
      if (!isInfo) {
        adjustHeight(descriptionRef);
      }
      
    }, [isInfo, description]);

    //for technologies
    useEffect(() => {
      if (isInfo) {
        adjustHeight(technologiesRef);
      }
    }, [isInfo, description]);

  return (
  <>
    <NavBar />  
  
    <div className = { styles.modalContainer }>
      <div className = { styles.header }>
        <span className = { styles.txtTitle }>EDIT MODAL</span>
      </div>

      <span className = { `${ styles.txtTitle} ${ styles.listHeader }` }>Select Modal</span>
      <div className={styles.modalsList}>
        {modals.map((modal) => (
          <div className = { styles.infoContainer } key={modal._id}>
            <span className = { styles.txtTitle }>{modal.title}</span>
            <button onClick={() => handleEditClick(modal)}>Edit</button>
          </div>
        ))}
      </div>
      
      <div className = { styles.btnContainer }>
        <button 
          className = { `${styles.txtTitle} ${ styles.saveBtn }` } 
          onClick = {handleSubmit}
        > 
          Save Changes 
        </button>
      </div>

      <AnimatePresence mode="wait">
        {currentModal && (
          <motion.div 
            className={styles.modalEditingSection}
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
            exit = {{opacity: 0}}
            transition = {{duration: 0.2, ease: "easeInOut"}}
          >
            <div className={styles.modal}>
              <label className = { styles.headerBg }>
                <span className = { styles.txtTitle }>{currentModal.title}</span>
              </label>

              {/* image container */}
              <div className = { styles.imageContainer }>
                <Slider {...settings} className = { styles.featuredImage }>
                  <img src={images.image1}/>
                  <img src={images.image2}/>
                  <img src={images.image2}/>
                  <img src={images.image2}/>
                </Slider>
                <div className = { styles.overlay }>
                  <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>Upload Image</button>
                </div>
                <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      multiple 
                      onChange={handleUploadFileChange} 
                    />
              </div>

              {/* Description and technologies */}
              <div className = { isInfo ? `${ styles.infoContainer } ${ styles.active }` : styles.infoContainer }>
                <AnimatePresence mode="wait">
                  {!isInfo && (
                    <motion.div 
                      className = { styles.description }
                      key = {"description"}
                      initial = {{opacity: 0}}
                      animate = {{opacity: 1, transition: {delay: 0.2}}}
                      exit = {{opacity: 0}}
                      transition = {{duration: 0.2,  ease: "easeInOut"}}
                      onAnimationComplete={() => adjustHeight(descriptionRef)}
                    >
                      <textarea 
                        ref = {descriptionRef}
                        row = "1"
                        className = { styles.txtSubTitle } 
                        value = {description}
                        onInput={() => adjustHeight(descriptionRef)}
                        onChange={(e) => setDescription(e.target.value)}
                        required  
                      />
                      
                      <div className = { styles.line }></div>
                    </motion.div>
                  )}

                  {isInfo && (
                    <motion.div 
                      className = { styles.technologies }
                      key = {"technologies"}
                      initial = {{opacity: 0}}
                      animate = {{opacity: 1, transition: {delay: 0.2}}}
                      exit = {{opacity: 0}}
                      transition = {{duration: 0.2, ease: "easeInOut"}}
                      onAnimationComplete={() => adjustHeight(technologiesRef)}
                    >
                      <textarea 
                        ref = {technologiesRef}
                        row = "1"
                        className ={ styles.txtSubTitle }
                        value = {description}
                        onInput={() => adjustHeight(technologiesRef)}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                      />

                      <div className = { styles.line }></div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className = { styles.infoBtn }>
                  <ul className = { styles.btns }>
                    <li>
                      <span 
                        className = { styles.descBtn }
                        onClick = { isInfo ? handleInfoBtn : undefined }
                      >
                        DESCRIPTION
                      </span>
                    </li>
                    <li>
                      <span 
                        className = { styles.techBtn }
                        onClick = { !isInfo ? handleInfoBtn : undefined }
                      >
                          TECHNOLOGIES
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
  );
};

export default Modal;
