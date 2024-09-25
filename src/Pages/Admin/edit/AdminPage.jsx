import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import Card from './Card';
import './styles/AdminPage.scss';
import { useNavigate } from 'react-router-dom';

const AdminPage = ({ onSave }) => {
  const [editableData, setEditableData] = useState({
    areaName: '',
    weather: '',
    quickfacts: '',
    image: '',
    weatherIcon: '',
    modalTitle: '', // Modal title added
    modalDescription: '',  // Modal description
    modalImages: []  // Array for modal images
  });

  const [imagePreview, setImagePreview] = useState('');
  const [weatherIconPreview, setWeatherIconPreview] = useState('');
  const [modalImagePreviews, setModalImagePreviews] = useState([]);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const navigate = useNavigate();

  //Fetching both Card and Modal Data from the DB
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/card'),  // Use direct URL here
      axios.get('http://localhost:5000/modal')  // Use direct URL here
    ])
      .then(([cardResponse, modalResponse]) => {
        if (cardResponse.data) {
          console.log('Card data fetched successfully:', cardResponse.data);
          setEditableData((prevData) => ({
            ...prevData,
            ...cardResponse.data,
          }));
          setImagePreview(
            cardResponse.data.image
              ? `http://localhost:5000${cardResponse.data.image}`
              : ''
          );
          setWeatherIconPreview(
            cardResponse.data.weatherIcon
              ? `http://localhost:5000${cardResponse.data.weatherIcon}`
              : ''
          );
        }
  
        if (modalResponse.data) {
          console.log('Modal data fetched successfully:', modalResponse.data);
          setEditableData((prevData) => ({
            ...prevData,
            modalTitle: modalResponse.data.modalTitle,
            modalDescription: modalResponse.data.modalDescription,
            modalImages: modalResponse.data.modalImages || [],
          }));
  
          setModalImagePreviews(
            modalResponse.data.modalImages
              ? modalResponse.data.modalImages.map(
                  (image) => `http://localhost:5000/${image}`
                )
              : []
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching card and modal data:', error);
      });
  }, []);
  
// Handle Change for the Card/Modal texts
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

// Handle file changes for Card
const handleCardFileChange = (e) => {
  const { name, files } = e.target;
  const file = files[0];

  if (name === 'image') {
    setEditableData((prevData) => ({ ...prevData, image: file }));
    setImagePreview(URL.createObjectURL(file));
  } else if (name === 'weatherIcon') {
    setEditableData((prevData) => ({ ...prevData, weatherIcon: file }));
    setWeatherIconPreview(URL.createObjectURL(file));
  }
};

// Handle file changes for Modal
const handleModalFileChange = (e) => {
  const { name, files } = e.target;
  const fileArray = Array.from(files);

  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  // Check if any selected files are unsupported
  const unsupportedFiles = fileArray.filter(file => !allowedTypes.includes(file.type));

  if (unsupportedFiles.length > 0) {
    alert('Unsupported file format. Only JPG, JPEG, and PNG images are allowed.');
    window.location.reload();  // Reload the page
    return;
  }

  // Check if the selected files are within the required range
  if (fileArray.length < 3) {
    alert('Please upload at least 3 images.');
    window.location.reload();  // Reload the page
    return;
  }

  if (fileArray.length > 5) {
    alert('You can only upload a maximum of 5 images.');
    window.location.reload();  // Reload the page
    return;
  }

  // If valid, update state
  if (name === 'modalImages') {
    setEditableData((prevData) => ({ ...prevData, modalImages: fileArray }));
    setModalImagePreviews(fileArray.map(file => URL.createObjectURL(file)));
  }
};



// Card Save Handler
const handleSaveCard = async () => {
  const formData = new FormData();
  formData.append('areaName', editableData.areaName);
  formData.append('weather', editableData.weather);
  formData.append('quickfacts', editableData.quickfacts);

  // Add Card images and weather icons
  if (editableData.image) formData.append('image', editableData.image);
  if (editableData.weatherIcon) formData.append('weatherIcon', editableData.weatherIcon);

  try {
    const response = await axios.post('http://localhost:5000/card', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    onSave(editableData);
    setIsEditingCard(false);
    console.log('Card saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving card data:', error);
  }
};


const handleSaveModal = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('modalTitle', editableData.modalTitle);  // Update the key
  formData.append('modalDescription', editableData.modalDescription);  // Update the key

  // Append images (files)
  if (Array.isArray(editableData.modalImages) && editableData.modalImages.length) {
    editableData.modalImages.forEach((file) => {
      formData.append('modalImages', file); // Use 'modalImages' as the key
    });
  }

  try {
    const response = await axios.post('http://localhost:5000/modal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Modal saved successfully:', response.data);
    setIsEditingModal(false);
  } catch (error) {
    console.error('Error saving modal data:', error.response?.data?.error || error.message);
    alert(error.response?.data?.error || 'An error occurred while uploading the modal');
  }
};
//Handle opening the Edit Modal
const handleEditModalClick = () => {
  setIsEditingModal(true);
};

//Handle opening the Edit Card
    const handleEditCardClick = () => {
    setIsEditingCard(true);
  };
  const handleEditAudioClick = () => {
    navigate('/audiomanage')
  };

  const handleViewCardClick = () => {
    navigate('/');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleCancel = () => {
    setIsEditingCard(false); // Close the editing card
    setIsEditingModal(false);// Close the editing modal
  };

return (
    <div className="admin-page">
      <h1>Admin Page</h1>

      {!isEditingCard && !isEditingModal && (
        <div>
          <button className="edit-button" onClick={handleEditCardClick}>
            Edit Card
          </button>
          <button className="edit-button" onClick={handleEditModalClick}>
            Edit Modal
          </button>
          <button className="edit-button" onClick={handleEditAudioClick}>
            Edit Audio
          </button>
        </div>
      )}

      {isEditingCard && (
        <div className="admin-page__content">
          {/* Editing Form for Card */}
          <div className="form-container">
            <h2>Edit Card</h2>

            {/* Image Upload */}
            <label>
              Image:
              <input type="file" name="image" onChange={handleCardFileChange} />
            </label>

            <label>
              Area Name:
              <input type="text" name="areaName" value={editableData.areaName} onChange={handleChange} />
            </label>

            {/* Weather Icon Upload */}
            <label>
              Weather Icon:
              <input type="file" name="weatherIcon" onChange={handleCardFileChange} />
            </label>

            <label>
              Weather:
              <input type="text" name="weather" value={editableData.weather} onChange={handleChange} />
            </label>

            <label>
              Quick Facts:
              <textarea name="quickfacts" value={editableData.quickfacts} onChange={handleChange} />
            </label>

            <button onClick={handleSaveCard}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>

          {/* Preview Section for Card */}
          <div className="admin-page__preview">
          <h2>Card Preview</h2>
          <div className="card-preview">
            {/* Card Image */}
            {imagePreview ? (
              <div className="card-preview__image">
                <img src={imagePreview} alt={editableData.areaName} className="card-preview__image-img" />
              </div>
            ) : (
              <p>No Image Available</p>
            )}

            {/* Card Content */}
            <div className="card-preview__content">
              {/* Card Header */}
              <div className="card-preview__header">
                <h2 className="card-preview__area-name">{editableData.areaName}</h2>
                <div className="card-preview__weather">
                  {weatherIconPreview ? (
                    <img src={weatherIconPreview} alt="Weather Icon" className="card-preview__weather-icon" />
                  ) : (
                    <p>No icon</p>
                  )}
                  <p>{editableData.weather}</p>
                </div>
              </div>

              {/* Divider */}
              <hr className="card-preview__divider" />

              {/* Quick Facts */}
              <div className="card-preview__quick-facts">
                <span>Quick Facts</span>
              </div>
                <div className="card__details">
                <p>{editableData.quickfacts}</p>
                </div>
    
  </div>
</div>

          </div>
        </div>
      )}

        
      {isEditingModal && (
        <div className="admin-page__content">
          {/* Editing Form for Modal */}
          <div className="form-container">
            <h2>Edit Modal</h2>
            <label>
              Modal Title:
              <input type="text" name="modalTitle" value={editableData.modalTitle} onChange={handleChange} />
            </label>

            <label>
              Modal Description:
              <textarea name="modalDescription" value={editableData.modalDescription} onChange={handleChange} />
            </label>

            {/* Modal Image Upload */}
            <label>
              Modal Images:
              <input type="file" name="modalImages" multiple onChange={handleModalFileChange} />
            </label>

            <button onClick={handleSaveModal}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>

    {/* Preview Section for Modal */}
    <div className="admin-page__preview">
      <h2>Modal Preview</h2>
      <div className="modal-preview">
        
        <p className="modal-title">{editableData.modalTitle}</p>
        <p>{editableData.modalDescription}</p>
        <div className="modal-images-preview">
        <Slider {...settings}>
               {modalImagePreviews.map((src, index) => (
                  <div className="carousel-slide" key={index}>
                  <img src={src} alt={`Modal Image ${index + 1}`} className="carousel-image" />
                </div>
              ))}
          </Slider>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="navigation-button">
        <button onClick={handleViewCardClick}>View Card</button>
      </div>
    </div>
  );
};

export default AdminPage;
