import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from './edit/Card';
import AreaButton from './edit/Areabutton';
import AdminPage from './edit/AdminPage';
import AudioUpload from './edit/AudioUpload';
import AudioManagement from './edit/AudioManagement';
import './Admin.module.scss';

function Admin() {
  // State to store card data fetched from the backend
  const [cardData, setCardData] = useState({
    areaName: '',
    weather: '',
    quickfacts: '',
    image: '',
    weatherIcon: '',
  });

  // State to keep track of the selected area
  const [selectedArea, setSelectedArea] = useState(null); 
  // State to manage visibility of the card
  const [isCardVisible, setIsCardVisible] = useState(false); 
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch card data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/card') // Fetch card data from backend
      .then(response => {
        if (response.data) {
          setCardData(response.data); // Update card data state
        }
      })
      .catch(error => console.error('Error fetching card data:', error));
  }, []);

  // Function to handle area button click and toggle card visibility
  const handleAreaClick = (area) => {
    if (selectedArea === area && isCardVisible) {
      setIsCardVisible(false);  // Hide card if it's already visible and clicked again
    } else {
      setSelectedArea(area);
      setIsCardVisible(true);   // Show the card if clicked
    }
  };

  // Function to handle saving data from AdminPage
  const handleAdminSave = (data) => {
    setCardData(data); // Update card data when saved in AdminPage
  };

  // Function to navigate to the AdminPage
  const handleEditClick = () => {
    navigate('/admin'); 
  };

  // Function to toggle modal state
  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen); 
  };

  return (
    <div className="app">
      {/* Define routes for different pages */}
      <Routes>
        {/* Route for the main page with map and area buttons */}
        <Route
          path="/"
          element={
            <>
              <div className="map">
                <h1>Interactive Map</h1>
                <AreaButton label="Fish Pond" onClick={() => handleAreaClick('Fish Pond')} />
              </div>
              {/* Button to navigate to Admin Page */}
              <button onClick={handleEditClick} className="edit-button">
                Admin Page
              </button>
              {/* Conditionally render the Card component if a card is visible */}
              {isCardVisible && selectedArea && (
                <Card
                  image={cardData.image}
                  areaName={cardData.areaName}
                  weather={cardData.weather}
                  quickfacts={cardData.quickfacts}
                  weatherIcon={cardData.weatherIcon} 
                  isModalOpen={isModalOpen} // Pass modal state to Card
                  toggleModal={toggleModal} // Pass function to toggle modal to Card
                />
              )}
            </>
          }
        />
        {/* Route for Admin Page */}
        <Route
          path="/admin"
          element={<AdminPage cardData={cardData} onSave={handleAdminSave} />}
        />
        {/* Route for Audio Management */}
        <Route path="audiomanage" element={<AudioManagement />} /> 
      </Routes>
    </div>
  );
};

export default Admin