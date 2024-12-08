import React, { useState, useEffect, useRef } from 'react';
import styles from './styles/CardsEdit.module.scss';
import ArrowIcon from '../../../assets/actions/Arrow_icon.png';
//import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import UseToast from '../utility/AlertComponent/UseToast';

import { motion, AnimatePresence } from 'framer-motion'
import NavBar from './navBar/NavBar';
import images from '../../../assets/for_landingPage/Images';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component
import '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';
import Confirmation from '../utility/ConfirmationComponent/Confirmation';



const Cards = () => {
  // toast alert pop up
  const mountToast = UseToast();

  const location = useLocation();
  const user = location.state?.user;
  //const { id } = useParams(); // Get the card ID from the route
  const [cards, setCards] = useState([]);  // Stores the current card data
  const [originalCards, setOriginalCards] = useState([]); // Stores the original data
  const [selectedCardId, setSelectedCardId] = useState(null);
  const fileInputRef = useRef(null); // Add file input reference

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDelete, setIsDelete] = useState(false); // Confirmation Modal 
  const [imgToDelete, setImgToDelete] = useState(null);
  const [fileId, setFileId] = useState(null);

  const handleDeleteBtn = () => {
    setIsDelete(!isDelete);
  }

  const confirmAndDelete = () => {
      setConfirmDelete(true);
  }

  useEffect(() => {
    if (confirmDelete && imgToDelete && fileId) {
        handleImageArchive(fileId, imgToDelete);
        setConfirmDelete(false);
    }
  }, [confirmDelete, imgToDelete, fileId]);

  // const placeholderImage = "https://via.placeholder.com/150"; // URL for a placeholder image
  
  // Fetch cards from the database
  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cards');
      const data = response.data;
      // If there are fetched cards, update the state; otherwise, keep initial cards
      if (data.length > 0) {
        setCards(data);
        setOriginalCards(data); // Store the original fetched data
      }
    } catch (error) {
      console.error('Error fetching all cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

    // Handle image upload for card
    const handleImageUpload = (e, cardId) => {
      const file = e.target.files[0];
      console.log('File selected:', file);
      // Allowed image formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        // Check if file exceeds 5MB
    if (file && file.size > 5 * 1024 * 1024) { // 10MB in bytes
      mountToast("File exceeds 5MB!", "error");
      window.location.reload(); // Reload the page if file exceeds 10MB
      return;
    }
      // Check if file type is allowed
      if (file && !allowedTypes.includes(file.type)) {
        mountToast("Only JPEG, PNG, and GIF image formats are allowed!", "error");
        // window.location.reload(); // Reload the page if file type is not allowed
        return;
      }
      if (file) {
        const imageUrl = URL.createObjectURL(file); // Create a local URL for the uploaded image
        console.log('Image URL created:', imageUrl);
        // Update the card state with the new image URL
        setCards(prevCards =>
          prevCards.map(card =>
            card._id === cardId ? { ...card, imagePreview: imageUrl, file } : card
          )
        );
      } else {
          console.error('No file selected'); // Debugging log
      }
    };

  // Handle quick facts update for card 
  const handleQuickFactsChange = (e, cardId) => {
    const newQuickFacts = e.target.value;

    // Update the card state
    setCards(prevCards =>
      prevCards.map(card =>
        card._id === cardId ? { ...card, quickFacts: newQuickFacts } : card
      )
    );
  };
// Handle submit to save only changed cards to the database
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  let changesMade = false; // Flag to track if any changes are made

  try {
    for (const card of cards) {
      const originalCard = originalCards.find((c) => c._id === card._id); // Get the original card

      // Compare the current card with the original card to see if there are changes
      const hasChanges =
        card.quickFacts !== originalCard.quickFacts ||
        card.file; // Check if a new file was uploaded

      if (hasChanges) {
          changesMade = true; // Set the flag to true if changes are detected
        const formData = new FormData();
        formData.append('areaName', card.areaName); // Area name is fixed
        formData.append('quickFacts', card.quickFacts);
        if (card.file) {
          formData.append('image', card.file); // Include the actual file object
        }

        // Update the card with changes
        const response = await axios.put(`http://localhost:5000/api/cards/${card._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to save card data');
        }
      }
    }
      // Show appropriate message based on whether changes were made
  if (changesMade) {
      mountToast("Data saved successfully!", "success"); // Show success message
      fetchCards();
      if (fileInputRef.current) fileInputRef.current.value = null; // Clear file inputted file on success
      return; // Reload the page after successful save
    } else {
      mountToast("No changes in Card Data", "error"); // Show message if no changes were detected
    }
  } catch (error) {
    console.error('Error saving card data:', error);
    mountToast("Error saving data. Please try again.", "error"); // Optional: Show error message
  }
};

  const handleImageDelete = async () => {
      try {
        if (confirmDelete && imgToDelete) {
          const response = await axios.delete(`http://localhost:5000/api/cards/${imgToDelete}/image`);
          if (response.status === 200) {
            setCards(prevCards =>
              prevCards.map(card =>
                card._id === imgToDelete ? { ...card, image: null, imagePreview: null, file: null } : card
              )
            );
            mountToast("Image deleted successfully", "success");
            setConfirmDelete(false);
            setImgToDelete(null);
            setIsDelete(false);
          }
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        mountToast("Error deleting image. Please try again.", "error");
      }
  };

  const handleImageArchive = async (imageId, imagePath) => {
    try {
      console.log('Archiving image...', imageId, imagePath);
      const response = await axios.put(`http://localhost:5000/api/archive/cards/${imageId}`, { imagePath });
      console.log("API Response:", response);
  
      if (response.status === 200) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card._id === imageId ? { ...card, image: null, isArchived: true } : card
          )
        );
        console.log('Archiving Success');
        mountToast("Image archived successfully", "success");
        setConfirmDelete(false);
        setImgToDelete(null);
        setIsDelete(false);
      }
    } catch (error) {
      console.error('Error archiving image:', error);
      mountToast("Error archiving image. Please try again.", "error");
    }
  };

  const navigate = useNavigate();
  const handleBackClick  = () => {
    navigate(`/map`); // Navigate to the specific card display page
  };

  // Get the root ID and and apply className 
  useEffect(() => {
    const rootDiv = document.getElementById("root");

    // Add or remove className based on current page

    if (location.pathname === "/cards") {
      rootDiv.classList.add(styles.rootDiv);
    } else {
      rootDiv.classList.remove(styles.rootDiv);
    }
  }, [location])


  // resize textarea based on content
  const textareaRef = useRef(null);

  const adjustHeight = (ref) => {
    if (ref) {
      ref.current.style.height = 'auto'; // Reset height
      ref.current.style.height = `${ref.current.scrollHeight}px`; // Set height to scroll height
    }
  };

  return (
    <>
      <NavBar />
      <div className={styles.cardsContainer}>
        <div className = { styles.header }>
          <span className = { styles.txtTitle }>EDIT CARDS</span>
        </div>

        <span className = { `${ styles.txtTitle} ${ styles.listHeader }` }>Select Card</span>
        
        <div className={styles.cardsList}>
        {cards.map((card) => (
          <div className = { styles.infoContainer } key={card._id}>
            <span className = { styles.txtTitle }>{card.areaName}</span>
            <button onClick={() => setSelectedCardId(card._id)}>Edit</button>
          </div>
        ))}
        </div>

        <button 
          className = { `${styles.txtTitle} ${ styles.btnSave }` } 
          onClick = {handleSubmit}
        > 
          Save Changes 
        </button>

        <AnimatePresence mode="wait">
        {cards.map(card => (
            card._id === selectedCardId && (
              <motion.div 
                key = {selectedCardId}
                className = { styles.cardEditingSection }
                initial = {{opacity: 0}}
                animate = {{opacity: 1}}
                exit = {{opacity: 0}}
                transition = {{duration: 0.2, ease: "easeInOut"}}
                onAnimationComplete = {() => adjustHeight(textareaRef)}
              >
                <div className = { styles.card }>
                  <div className={styles.popupImage}>
                    {/* <img src={ images.image1 } alt={ card.areaName }/> tempoorary replace the marker.img for visualization */}
                    
                    {card.imagePreview ? (
                      <div className = { styles.previewImg }>
                        <div className = { styles.overlay }>
                          <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>Upload Image</button>
                        </div>

                        <input
                          type="file"
                          accept="image/"
                          ref={fileInputRef}
                          id={`image-upload-${card._id}`}
                          onChange={(e) => handleImageUpload(e, card._id)}
                        />

                        <img src={card.imagePreview} alt="Uploaded Image Preview" />
                      </div>  
                    ) : card.image ? (
                      <div className = { styles.uploadedImg }>
                        <div className = { styles.overlay }>
                          <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>
                            Upload
                            <input
                            type="file"
                            accept="image/"
                            ref={fileInputRef}
                            id={`image-upload-${card._id}`}
                            onChange={(e) => handleImageUpload(e, card._id)}
                            /> 
                          </button>

                          <button 
                            className = { `${ styles.txtTitle} ${ styles.deleteBtn }` }
                            //type="button" onClick={() => handleDeleteBtn(card._id)}
                            type="button" onClick={() => { setFileId(card._id); setImgToDelete(card.image); handleDeleteBtn();}}
                          >
                            Delete
                          </button>
                        </div>
                        <img src={`http://localhost:5000/uploads/cardsImg/${card.image}`} alt="Fetched Image Preview" />
                      </div>
                    ) : (
                      <div className = { styles.noImg }>
                        <div className = { styles.overlay }>
                          <button className = { `${ styles.txtTitle} ${ styles.uploadBtn }` }>Upload Image</button>
                        </div>

                        <input
                          type="file"
                          accept="image/"
                          ref={fileInputRef}
                          id={`image-upload-${card._id}`}
                          onChange={(e) => handleImageUpload(e, card._id)}
                        />

                        
                          <span className = { styles.txtTitle }>No Image available</span>
                      </div>
                    )}

                  </div>

                  <div className={styles.cont1}>

                    <span className = {styles.txtTitle} >{card.areaName}</span>

                    <div className = { styles.line }></div>

                    <textarea 
                      ref = {textareaRef}
                      className = { styles.quickFacts } 
                      value = { card.quickFacts }
                      onInput = {() => adjustHeight(textareaRef)}
                      onChange = {(e) => handleQuickFactsChange(e, card._id)}
                    />

                  </div>  
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isDelete && (
          <motion.div 
              className = { styles.confirmation }
              initial = {{opacity: 0}}
              animate = {{opacity: 1}}
              exit = {{opacity: 0}}
              transition = {{duration: 0.2, ease: "easeInOut"}}
          >
              <Confirmation 
                  onCancel = {() => handleDeleteBtn()}
                  setConfirmDelete = { confirmAndDelete }
              />
          </motion.div>
        )}
      </AnimatePresence> 
    </>
  );
};

export default Cards;
