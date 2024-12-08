import React from "react";
import Slider from "react-slick";
import styles from "./StartingModal.module.scss";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import icons from './guideIcons/Icons'
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
                <p>Left click or Touch.</p>
              </div>
              <div className={styles.controls}>
                <h2>Zoom:</h2>
                <p>Mouse Scroll or Pinch.</p>
              </div>
              <div className={styles.controls}>
                <h2>Find path:</h2>
                <p>Select Pathfinding Tab <div className={styles.guideImg}><img src={icons.pathfinding} alt="pathfinding" /></div></p>
              </div>
              <div className={styles.controls}>
                <h2>Find more infos:</h2>
                <p>Select navigation menu <div className={styles.guideImg}><img src={icons.navigation} alt="navigation" /></div></p>
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
              <span>
                Go to navigation menu <div className={styles.guideImg}><img src={icons.navigation} alt="navigation" /></div> and click on the feedback button <div className={styles.guideImg}><img src={icons.feedback} alt="feedback" /></div>.
              </span>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default StartingModal;
