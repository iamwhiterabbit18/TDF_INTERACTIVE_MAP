import React, { useState, useEffect, useRef } from 'react';
import styles from './AddMarker.module.scss';
import markerData from './markerData';
import calculatePosition from '@utils/CalculatePosition.jsx';
import AddMarkerModal from './AddMarkerModal.jsx';

const AddMarker = ({ renderer, container, camera, addMarkerMode }) => {
  // marker data holder
  const [markerPos, setMarkerPos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);

  const btnRef = useRef(null);
  const containerRef = useRef(null);

  const toggleAddMarker = () => {
    const btn = btnRef.current;
    const container = containerRef.current;
  
    if (btn && container) {
      if (btn.style.display === "none") {
        btn.style.display = "block";
        container.style.display = "none";
      } else {
        btn.style.display = "none";
        container.style.display = "flex";
      }
    }
  };

  const handleDragStart = (e, marker) => {
    e.dataTransfer.setData('marker', JSON.stringify(marker));
    console.log(`${marker.name} is being dragged`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const marker = JSON.parse(e.dataTransfer.getData('marker'));
    console.log(`${marker.name}`, "got dropeed")

    const dropX = e.clientX;
    const dropY = e.clientY;
    const canvasRect = container.getBoundingClientRect();
    console.log("Canvas Rect: ", canvasRect)
    const screenPosition = {
      x: dropX - canvasRect.left,
      y: dropY - canvasRect.top - 200
    };
    console.log("Screen Position Relative to Canvas:", screenPosition);
    
    const worldPosition = calculatePosition(screenPosition, camera, container);
    console.log(`${marker.name} dropped at`, worldPosition);

    


    setMarkerPos((prev) => {
      const markerIndex = prev.findIndex((m) => m.name === marker.name && m.siteName === marker.siteName);
      
      if (markerIndex >= 0) {
        // Update existing marker's position
        const updatedMarkers = [...prev];
        updatedMarkers[markerIndex] = { 
          ...updatedMarkers[markerIndex], 
          screenPosition, 
          worldPosition 
        };
        return updatedMarkers;
      }
      
      // If marker doesn't exist, set current marker for modal
      setCurrentMarker({
        name: marker.name,
        screenPosition,
        worldPosition
      });
      setIsModalVisible(true);
      
      // Return existing markers
      return prev;
    });

    // Update the marker position
    // setMarkerPos((prev) => {
    //   const markerIndex = prev.findIndex((m) => m.name === marker.name);
    //   if (markerIndex >= 0) {
    //     const updatedMarkers = [...prev];
    //     console.log("updatedMarkers: ", updatedMarkers)
    //     updatedMarkers[markerIndex] = { ...updatedMarkers[markerIndex], screenPosition, worldPosition }
    //     return updatedMarkers;
    //   }
    //   return [...prev, { name: marker.name, screenPosition, worldPosition }];
    // });
    // console.log("Markers: ", markerPos)
  };

  const handleSave = (siteName) => {
    if (currentMarker) {
      setMarkerPos((prev) => [
        ...prev,
        { ...currentMarker, siteName}
      ])
    }
  }
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentMarker(null);
  }

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const currentContainer = container;
  
    if (currentContainer) {
      currentContainer.addEventListener('dragover', handleDragOver);
      currentContainer.addEventListener('drop', handleDrop);
    }
  
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('dragover', handleDragOver);
        currentContainer.removeEventListener('drop', handleDrop);
      }
    };
  }, []);
  
  return (
      <div
        id="addMarker"
      >
        <button 
        ref={btnRef} 
        className={styles.button}
        onClick={(e) => {toggleAddMarker(); addMarkerMode();}}>Add Marker</button>

        <div className={styles.container} ref={containerRef}>
          <button
          className={styles.close} 
          onClick={(e) => {toggleAddMarker(); addMarkerMode();}}>
            Close
          </button>
          <div 
          onDragOver={(e) => e.preventDefault()} // Allow drop
          onDrop={handleDrop}
          className={styles.markerBar}>
            {/* Draggable initial markers */}
            {markerData.map((data, index) => (
              <div
                key={`initial-${data.name}-${index}`}
                className={styles.markerIcon}
                draggable
                onDragStart={(e) => handleDragStart(e, data)}
              >
                <img src={data.icon} alt={data.name} />
              </div>
            ))}

            {/* Draggable dropped markers */}
            {markerPos.map((marker, index) => (
              <div
                key={`dropped-${marker.name}-${index}`}
                className={styles.markerIcon}
                draggable
                style={{
                  position: 'absolute',
                  left: marker.screenPosition.x,
                  top: marker.screenPosition.y,
                }}
                onDragStart={(e) => handleDragStart(e, marker)}
              >
                <img src={markerData.find((m) => m.name === marker.name)?.icon} alt={marker.name} />
              </div>
            ))}
          </div>
        </div>
        
      <AddMarkerModal
        isVisible={isModalVisible}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
      </div>

    
  );
};

export default AddMarker