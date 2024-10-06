import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import styles from './Markers.module.scss';
import markerData from '../../../../../assets/API/marker_data';
import Popup from './popup/Popup';

// data pipe here
const markers = markerData;
const screenWidth = window.innerWidth;

const Markers = ({ scene, camera, container, moveToMarker }) => {
  const[hoveredMarker, setHoveredMarker] = useState(null);
  const animationFrameRef = useRef();
  const [selectedMarker, setSelectedMarker] = useState(null);
  // const [popups, setPopups] = useState({});

  const handleHover = (index) =>{
    setHoveredMarker(index);
  }

  const handleExit = () =>{
    setHoveredMarker(null);
  }

  const calculatePosition = useCallback((worldPosition) =>{
    const screenPosition = worldPosition.clone().project(camera);
  
    const halfWidth = container.clientWidth / 2;
    const halfHeight = container.clientHeight / 2;
  
    const x = (screenPosition.x * halfWidth) + halfWidth;
    const y = -(screenPosition.y * halfHeight) + halfHeight;
  
    return { x, y };
  }, [camera, container]);

  // pos updater
  const updateMarkerPositions = useCallback(() => {

    markers.forEach((marker, index) => {
      const { x, y } = calculatePosition(marker.position);
      const markerElement = document.getElementById(`marker-${index}`);
      if (markerElement) {
        markerElement.style.left = `${x}px`;
        markerElement.style.top = `${y}px`;
      }
    });

    // calculate popup pos
    if(selectedMarker){
      let offset = {
        top: screenWidth > 666 ? 10 : -150,
        left: screenWidth > 666 ? 10 : -150,
      }
      const { x, y } = calculatePosition(selectedMarker.position);
      const popupElement = document.getElementById('popup');
      if (popupElement) {
        popupElement.style.left = `${x + offset.left}px`;
        popupElement.style.top = `${y + offset.top}px`;
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateMarkerPositions);
  }, [markers, calculatePosition, selectedMarker]);

  const handleMarkerCLick = (marker) => {
    if(selectedMarker == marker){
      console.log('same marker');
      return;
    }
    else{
      setSelectedMarker(null);
      moveToMarker(marker.position, () => {
        setSelectedMarker(marker);  // Display popup after moving to the marker
      });
    }
  };
  const handleClosePopup = (marker) =>{
    setSelectedMarker(null);
  }

  // updates marker pos
  useEffect(() => {
    if (scene && camera && container) {
      updateMarkerPositions();
      return () => {
        if(animationFrameRef.current){
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [scene, camera, container, updateMarkerPositions]);

  return (
    <>
      {markers.map((marker, index) => (
        <div
          key={index}
          id={`marker-${index}`}
          className={styles.marker}
          style={{ position: 'absolute' }}
          onClick={() => handleMarkerCLick(marker)}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={handleExit}
        >
          <img src={marker.icon} alt={marker.name} />
          <div className={`${styles.tooltip} ${
            hoveredMarker === index ? styles.tooltipHover : ''
          }`}>
            {marker.name}
          </div>
        </div>
      ))}

      {
        selectedMarker && (
          <Popup
            marker={selectedMarker}
            position={calculatePosition(selectedMarker.position)}
            onClose={handleClosePopup}
          />
        )
      }
    </>
  );
};

export default Markers;
