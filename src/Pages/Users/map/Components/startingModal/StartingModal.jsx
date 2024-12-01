import React from "react";
import Slider from "react-slick";
import styles from "./StartingModal.module.scss";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const StartingModal = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true, // Enable swipe gestures
    touchMove: true, // Allow touch gestures
    draggable: true, // Enable mouse dragging for desktop
  };
  

  return (
    <div id="startingModal">
      <div className={styles.container}>
        <Slider {...settings}>
          {/* First Slide: Instructions */}
          <div className={styles.content}>
            <button className={styles.close}>Close</button>
            <div className={styles.textCont}>
              <h1>TDF - Interactive Map</h1>
              <hr />
              <div className={styles.controls}>
                <h2>Select:</h2>
                <p>Left click or touch.</p>
              </div>
              <div className={styles.controls}>
                <h2>Zoom:</h2>
                <p>Scroll or pinch.</p>
              </div>
              <div className={styles.controls}>
                <h2>Zoom:</h2>
                <p>Scroll or pinch.</p>
              </div>
              <div className={styles.controls}>
                <h2>Zoom:</h2>
                <p>Scroll or pinch.</p>
              </div>
            </div>
          </div>

          {/* Second Slide: Feedback Reminder */}
          <div className={styles.content}>
            <button className={styles.close}>Close</button>
            <div className={styles.textCont}>
              <h1>Feedback Reminder</h1>
              <hr />
              <p>
                Your feedback is valuable! Please let us know your thoughts about
                the TDF Interactive Map.
              </p>
              <button className={styles.feedbackButton}>Give Feedback</button>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default StartingModal;
