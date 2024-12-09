import React, { useState, useEffect, useRef } from 'react';
import styles from './AddMarker.module.scss';
import markerData from './markerData';
import Click from '@utils/Click.js';
import AddMarkerModal from './AddMarkerModal.jsx';
import addIcon from './add.png'

import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import { useLocation, useNavigate } from 'react-router-dom';


const AddMarker = ({ scene, container, camera, addMarkerMode }) => {
  // marker data holder
  const [markerPos, setMarkerPos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);

  const btnRef = useRef(null);
  const containerRef = useRef(null);

  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const user = location.state?.user || authUser;

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
    console.log(`${marker.name}`, "got dropped");

    // Use Click utility to calculate world position
    const clickInstance = new Click(e, camera, scene);
    
    // Get the intersection point from the Click utility
    const intersects = clickInstance.raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      const worldPosition = intersects[0].point;
      const screenPosition = {
        x: e.clientX - container.getBoundingClientRect().left,
        y: e.clientY - container.getBoundingClientRect().top
      };

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
          icon: marker.icon,
          screenPosition,
          worldPosition
        });
        setIsModalVisible(true);
        
        // Return existing markers
        return prev;
      });
    }
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
        {(user?.role === "staff" || user?.role === "admin") && (
        <button 
        ref={btnRef} 
        className={styles.button}
        onClick={(e) => {toggleAddMarker(); addMarkerMode();}}>
          <span>Add Marker</span>
          <img src={addIcon} alt="add marker icon" />
        </button>
        )}

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
                  top: marker.screenPosition.y  - 200,
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
        worldPosition={currentMarker?.worldPosition}
        icon={currentMarker?.icon}  // Pass the icon here
        iconName={currentMarker?.name}
      />
      </div>

    
  );
};

export default AddMarker