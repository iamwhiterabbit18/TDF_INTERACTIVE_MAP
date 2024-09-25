import React, { useEffect, useState } from 'react';
import axios from 'axios'; // To fetch data from the server
import Slider from 'react-slick'; // Import React Slick for the carousel
import './styles/Modal.scss';

const Modal = ({ onClose }) => {
  // State to hold modal data
  const [modalData, setModalData] = useState({
    images: [],
    title: '', 
    description: '',
  });

  const [onclickAudioUrl, setOnclickAudioUrl] = useState(''); // State to store the onclick audio URL

  // Fetch the modal data from the server when the component is mounted
  useEffect(() => {
    axios
      .get('http://localhost:5000/modal') // Fetch modal data from the server
      .then((response) => {
        const data = response.data; // Extract data from the response
        // Update modal data state with fetched data
        setModalData({
          images: data.modalImages.map(
            (image) => `http://localhost:5000/${image}` // Construct image URLs
          ),
          title: data.modalTitle || 'No title available.', // Default if no title provided
          description: data.modalDescription || 'No description available.', // Default if no description provided
        });
      })
      .catch((error) => {
        console.error('Error fetching modal data:', error); // Log any errors encountered during fetch
      });
  }, []); // Empty dependency array ensures it runs once when modal opens

  let currentlyPlayingAudio = null; // To store the currently playing audio instance

  // Function to handle playing the Onclick audio when the button is clicked
  const handleOnclickPlay = async () => {
    try {
      // If there's already audio playing, prevent the button from triggering again
      if (currentlyPlayingAudio) {
        return; // Exit early if audio is already playing
      }
  
      // Make a GET request to fetch the Onclick audio
      const response = await axios.get('http://localhost:5000/api/audio/onclick', { responseType: 'blob' });
  
      // Check if no audio is fetched
      if (!response.data || response.data.size === 0) {
        alert('No Assigned Audio/Fetched Audio'); // Alert if no audio
        return; // Exit if no audio is fetched
      }
  
      // Convert the audio blob into a URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a new audio instance and play it
      const audio = new Audio(url);
      audio.play();
  
      // Set the newly created audio instance as the currently playing audio
      currentlyPlayingAudio = audio;
  
      // Stop the audio when it finishes playing and reset the instance
      audio.onended = () => {
        currentlyPlayingAudio = null; // Reset when audio finishes
      };
  
    } catch (error) {
      alert('No Assigned Audio or Failed Fetching the Audio'); // Alert on error
      console.error('Error fetching Onclick audio:', error); // Log any errors
    }
  };
  
  // Slick settings for the carousel
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay speed in milliseconds
    pauseOnHover: true, // Pause autoplay on hover
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button> {/* Close button for the modal */}
        <br />

        {/* Image Carousel */}
        {modalData.images.length > 0 ? (
          <Slider {...settings}> {/* Render the carousel with settings */}
            {modalData.images.map((image, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={image || '/path/to/fallback-image.jpg'} // Display image or fallback
                  alt="" //{`Image ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No images available.</p> // Fallback text if no images
        )}

        {/* Modal Text Content */}
        <div className="modal__content">
          <div className="modal__header">
            <h2>{modalData.title || 'No Title Available'}</h2> {/* Display title */}
            <div className="modal__icons">
              <i className="material-icons" onClick={handleOnclickPlay}>volume_up</i> {/* Play audio icon */}
            </div> 
          </div>

          <p>{modalData.description || 'No Description Available'}</p> {/* Display description */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
