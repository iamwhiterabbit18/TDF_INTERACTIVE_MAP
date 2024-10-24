import React, { useRef, useState } from 'react';
import axios from 'axios';
import icon from '/src/assets/Icon.js';
import Slider from 'react-slick';
import styles from './Modal.module.scss';

const Modal = ({ onClose, details, modalData }) => {
  const audioRef = useRef(new Audio()); // Create a reference for the audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing

  const onClickAudio = async (modalId) => {
    if (!modalId) {
      console.error('No modal ID provided');
      return;
    }

    try {
      let audio = [];
      const response = await axios.get(`http://localhost:5000/api/audio`);
      audio = response.data;
      const playAudio = audio.find(obj => obj._id === modalId);

      if (playAudio && playAudio.filePath) {
        if (isPlaying) { // If audio is already playing, do not play again
          console.log('Audio is already playing.');
          return; 
        }

        audioRef.current.src = `http://localhost:5000/${playAudio.filePath}`; // Set audio source
        audioRef.current.play(); // Play the audio
        setIsPlaying(true); // Set audio state to playing
        console.log('Playing Audio:', playAudio.filePath);

        audioRef.current.onended = () => {
          setIsPlaying(false); // Reset state when audio ends
        };
      } else {
        console.error('Audio file not found.');
      }
    } catch (error) {
      console.error('Error fetching audio data:', error);
    }
  };

  const handleClose = () => {
    audioRef.current.pause(); // Pause the audio
    audioRef.current.currentTime = 0; // Reset to the beginning
    setIsPlaying(false); // Reset playback state
    onClose(); // Call the original onClose function
  };

  const settings = { // Carousel settings
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log('Modal Data:', modalData);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>Close</button>

        <h1>{modalData.title}</h1>
        <button onClick={() => onClickAudio(modalData.modal_id)} disabled={isPlaying}>
          <img src={icon.actions.speaker} alt="speaker" />
          {isPlaying && <span> Playing...</span>} {/* Optional message */}
        </button>
        <p>{modalData.description}</p>
        
        {/* Carousel for images */}
        <div className={styles.imgCont}>
          {modalData.modalImages && modalData.modalImages.length > 0 ? (
            <div className={styles.imageCarousel}>
              <Slider {...settings}>
                {modalData.modalImages.map((image, index) => (
                  <div key={index} className="slickSlide">
                    <img 
                      src={`http://localhost:5000/uploads/modalImages/${image}`}
                      alt={`Image ${index}`} 
                      className="carouselImage"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <center><p>No images available.</p></center>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
