import {} from 'react';
import axios from 'axios';
import icon from '/src/assets/Icon.js';
import Slider from 'react-slick';
import styles from './Modal.module.scss';


const Modal = ({ onClose, details , modalData }) => {

  const settings = { //carousel settings
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>Close</button>

          <h1>{modalData.title}</h1><button>
                      <img src={icon.actions.speaker} alt="speaker" />
                    </button>
          <p>{modalData.description}</p>
        {/* Carousel for images */}
        <div className={styles.imgCont}>
          {modalData.modalImages && modalData.modalImages.length > 0 ? (
            <div className={styles.imageCarousel}>
              <Slider {...settings}>
              {modalData.modalImages.map((image, index) => (
                <div key={index} className="slickSlide">
                  <img src={`http://localhost:5000/uploads/modalImages/${image}`}
                  alt={`Image ${index}`} 
                  className="carouselImage"
                  />
                </div>
              ))}
              </Slider>
            </div>
          ) : (
            <center>
            <p>No images available.</p>
            </center>
          )}
        </div>
        </div>
      </div>
    );
};


export default Modal;
