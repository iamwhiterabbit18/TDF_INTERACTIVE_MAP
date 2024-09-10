import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import styles from './Markers.module.scss';

const Markers = ({ markers, scene, camera, container, moveToMarker }) => {
  const[hoveredMarker, setHoveredMarker] = useState(null);
  const animationFrameRef = useRef();

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

  const updateMarkerPositions = useCallback(() => {
    markers.forEach((marker, index) => {
      const { x, y } = calculatePosition(marker.position);
      const markerElement = document.getElementById(`marker-${index}`);
      if (markerElement) {
        markerElement.style.left = `${x}px`;
        markerElement.style.top = `${y}px`;
      }
    });

    animationFrameRef.current = requestAnimationFrame(updateMarkerPositions);
  }, [markers, calculatePosition]);

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
      {markers.map((marker, index) => {
        return(
        <div
          key={index}
          id={`marker-${index}`}
          className={styles.marker}
          style={{ position: 'absolute' }}
          onClick={() => moveToMarker(marker.position)}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={handleExit}
        >
          <img src={marker.icon} alt={marker.name} />
          <div className={`${styles.tooltip} ${
            hoveredMarker === index ? styles.tooltipHover : ''
          }`}>
            {marker.name}</div>
        </div>
        );
      }
      )}
    </>
  );
};

export default Markers;
