import React, { useState, useEffect } from 'react';
import styles from './styles/CardsEdit.module.scss';
import ArrowIcon from '../../../assets/actions/Arrow_icon.png';
//import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cards = () => {
  //const { id } = useParams(); // Get the card ID from the route
  const [cards, setCards] = useState([]);  // Stores the current card data
  const [originalCards, setOriginalCards] = useState([]); // Stores the original data

  const placeholderImage = "https://via.placeholder.com/150"; // URL for a placeholder image
  
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
    
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a local URL for the uploaded image
      console.log('Image URL created:', imageUrl);
      // Update the card state with the new image URL
      setCards(prevCards =>
        prevCards.map(card =>
          card._id === cardId ? { ...card, image: imageUrl, file } : card
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
        alert('Data saved successfully!'); // Show success message
        window.location.reload(); // Reload the page after successful save
      } else {
        alert('No changes in Card Data'); // Show message if no changes were detected
      }
    } catch (error) {
      console.error('Error saving card data:', error);
      alert('Error saving data. Please try again.'); // Optional: Show error message
    }
  };

  const navigate = useNavigate();
  const handleBackClick  = () => {
    navigate(`/admin`); // Navigate to the specific card display page
  };

 

  return (
      <div className={styles.cardsContainer}>
       <div className={styles.header}>
        <h1>Edit Cards</h1>
        <button className={styles.backButton} onClick={handleBackClick}>
           <img src={ArrowIcon} alt="Back" className={styles.icon} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {cards.map(card => (
            <div key={card._id} className={styles.card}>
              <h3>{card.areaName}</h3>

              <div className={styles.imageUpload}>
                <label htmlFor={`image-upload-${card._id}`}>Upload Image</label>
                <input
                  type="file"
                  accept="image/"
                  id={`image-upload-${card._id}`}
                  onChange={(e) => handleImageUpload(e, card._id)}
                />
                {card.image && <img src={`http://localhost:5000${card.image || placeholderImage}`} alt="Uploaded preview" />}
              </div>

              <div className={styles.quickFacts}>
                <label htmlFor={`quick-facts-${card._id}`}>Quick Facts:</label>
                <textarea
                  id={`quick-facts-${card._id}`}
                  value={card.quickFacts}
                  onChange={(e) => handleQuickFactsChange(e, card._id)}
                />
              </div>
            </div>
          ))}
          <button className={styles.submitBtn} type="submit">Save Changes</button>
          <div className={styles.navigationButton}>
          </div>
        </form>
      </div>



    
    
  );
};

export default Cards;
