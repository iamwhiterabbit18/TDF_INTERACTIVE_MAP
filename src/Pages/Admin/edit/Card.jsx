import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './styles/Card.scss';

const Card = ({ isModalOpen, toggleModal }) => {
  // State to hold card data
  const [cardData, setCardData] = useState({
    image: '',
    areaName: '',
    weather: '',
    weatherIcon: '',
    quickfacts: '',
  });

  // Fetch the card data from the server when the component is mounted
  useEffect(() => {
    axios
      .get('http://localhost:5000/card') // Fetch card data from the server
      .then((response) => {
        const data = response.data; // Extract data from the response
        // Update the card data state with fetched data
        setCardData({
          image: data.image ? `http://localhost:5000${data.image}` : '', // Construct image URL if available
          areaName: data.areaName || 'Unknown Area', // Default to 'Unknown Area' if not provided
          weather: data.weather || 'Unknown Weather', // Default to 'Unknown Weather' if not provided
          weatherIcon: data.weatherIcon ? `http://localhost:5000${data.weatherIcon}` : '', // Construct weather icon URL if available
          quickfacts: data.quickfacts || 'No quick facts available', // Default if no quick facts
        });
      })
      .catch((error) => {
        console.error('Error fetching card data:', error); // Log any errors encountered during fetch
      });
  }, []); // Empty dependency array ensures this runs only on mount

  // Destructure card data for easier access
  const { image, areaName, weather, weatherIcon, quickfacts } = cardData;

  return (
    <div className="card">
      {/* Card Image */}
      <div className="card__image">
        {image ? (
          <img src={image} alt={areaName} /> // Display image if available
        ) : (
          <p>No Image Available</p> // Fallback text if no image
        )}
      </div>

      <div className="card__content">
        {/* Card Header */}
        <div className="card__header">
          <h2>{areaName}</h2> {/* Display area name */}
          <div className="card__weather">
            {weatherIcon ? (
              <img src={weatherIcon} alt="Weather Icon" /> // Display weather icon if available
            ) : (
              <p>No icon</p> // Fallback text if no icon
            )}
            <span>{weather}</span> {/* Display weather information */}
          </div>
        </div>

        <hr className="card__divider" /> {/* Divider between header and content */}

        {/* Quick Facts */}
        <div className="card__quick-facts">
          <span>Quick Facts</span> {/* Section title */}
        </div>

        {/* Quick Facts Details */}
        <div className="card__details">
          <p>{quickfacts}</p> {/* Display quick facts information */}
        </div>

        {/* Footer */}
        <div className="card__footer">
          <a href="#" onClick={toggleModal}>View Full Details</a> {/* Link to view more details, triggers modal toggle */}
        </div>
      </div>

      {/* Modal component for detailed view */}
      {isModalOpen && (
        <Modal
          onClose={toggleModal} // Pass close function to modal
        />
      )}
    </div>
  );
};

export default Card;
