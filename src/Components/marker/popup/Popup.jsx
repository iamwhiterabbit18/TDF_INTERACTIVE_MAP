import React, { useEffect, useState } from "react";
import styles from './Popup.module.scss';
import icon from '../../../assets/Icon.js';
import Time from './Time.jsx';
import Modal from "./modal/Modal.jsx";

function Popup({ marker, onClose, isAdmin=true }) {

  const [isOpen, setIsOpen] = useState(false);
  const onViewFullDetail = (data) =>{
    setIsOpen(!isOpen);
  }
  const onCloseModal = () =>{
    setIsOpen(false);
  }
  return (
    <>
      <div
          id="popup"
          className={styles.popupContent}
          style={{ position: "absolute", zIndex: 100 }}>
            {
              isAdmin && <a href="/administrator">Edit</a>
            }
          <div className={styles.closeBtn} onClick={onClose}>
              <button>
                  <img src={icon.actions.close} alt="close" />
              </button>
          </div>
          <div className={styles.popupImage}>
              <img src={marker.img} alt={marker.name}/>
          </div>
          <div className={styles.cont1}>
                  <h1>{marker.name}</h1>
                  <div className={styles.weather}>
                    <div className={styles.logo}>
                      <img src={icon.weather.cloudy} alt="weatherIcon" />
                    </div>
                    <div className={styles.weatherDeets}>
                      <p>Mildly sunny - 14°</p>
                      <Time />
                    </div>
                  </div>
          </div>
          <hr />
          <div className={styles.cont2}>
                  <h2>Quick Facts</h2>
                  <div className={styles.btns}>
                    <button>
                      <img src={icon.actions.wayfind} alt="wayfind" />
                    </button>
                    <button>
                      <img src={icon.actions.speaker} alt="speaker" />
                    </button>
                  </div>
          </div>
          <p>{marker.description}</p>
          <div className={styles.fullDeets}>
          <button
          className={styles.deets}
          onClick={()=> onViewFullDetail(marker)}>
              <p>View Full Details {'>'}</p>
          </button>
          </div>
      </div>
      {
        isOpen && <Modal details={marker} onClose={onCloseModal} />
      }
    </>
  )
}

export default Popup