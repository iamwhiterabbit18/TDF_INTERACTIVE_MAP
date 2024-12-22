import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AddMarker.module.scss';
import markerData from './markerData';
import Click from '@utils/Click.js';

// import components
import AddMarkerModal from './AddMarkerModal.jsx';
import AddIcon from './AddIcon.jsx';

import plusIcon from './add.png'
import uploadIcon from './upload.png'

import { useAuth } from '/src/Pages/Admin/ACMfiles/authContext';
import { useLocation, useNavigate } from 'react-router-dom';


const AddMarker = ({ scene, container, camera, addMarkerMode, isOnAddMarker }) => {
  // marker data holder
  const [markerPos, setMarkerPos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [isAddIcon , setIsAddIcon] = useState(false);
  const animationFrameRef = useRef();

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
    console.log(markerPos);

  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentMarker(null);
  }

  const calculatePosition = useCallback((worldPosition) => {
    // Convert 3D world position to 2D screen coordinates
    if (!camera || !container) return { x: 0, y: 0 };
  
    const vector = worldPosition.clone();
    vector.project(camera);
  
    const widthHalf = container.clientWidth / 2;
    const heightHalf = container.clientHeight / 2;
  
    const x = (vector.x * widthHalf) + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;
  
    return { x, y };
  }, [camera, container]);

  useEffect(() => {
    console.log(markerPos);
  }, [markerPos]);

  const updateMarkerPositions = useCallback(() => {
    markerPos.forEach((marker, index) => {
      if (marker.worldPosition) {
        const { x, y } = calculatePosition(marker.worldPosition);
        const markerElement = document.getElementById(`marker-${index}`);
        // console.log(markerElement);
        if (markerElement) {
          // Adjust positioning to center the marker
          markerElement.style.position = 'absolute';
          markerElement.style.left = `${x}px`; // Subtract half the marker width
          markerElement.style.top = `${y}px`; // Subtract half the marker height
        }
      }
    });
  
    // Continue animation frame
    animationFrameRef.current = requestAnimationFrame(updateMarkerPositions);
  }, [markerPos, calculatePosition]);

  // updates marker pos
    useEffect(() => {
      if (scene && camera && container) {
        // Set up the initial animation frame
        animationFrameRef.current = requestAnimationFrame(updateMarkerPositions);
        
        // Clean up function
        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      }
    }, [scene, camera, container, updateMarkerPositions]);

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


  // add icon functions
  const addIcon = () =>{
    setIsAddIcon(!isAddIcon);
    console.log(isAddIcon)
  }
  
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
          <img src={plusIcon} alt="add marker icon" />
        </button>
        )}

        <div className={styles.container} ref={containerRef}>
          <button
          className={styles.close} 
          onClick={(e) => {toggleAddMarker(); addMarkerMode();}}>
            Close 
            {/* change this to bigger close button */}
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
              <div 
                className={styles.markerIcon}
                onClick={(e) => {addIcon();}}>
                <img src={uploadIcon} alt="upload marker" />
              </div>
            {/* Draggable dropped markers */}
            {/* {markerPos.map((marker, index) => (
              <div
                key={`dropped-${marker.name}-${index}`}
                id={`marker-${index}`}
                className={styles.markerIcon}
                draggable
                style={{
                  // position: 'absolute',
                  // left: marker.screenPosition.x - 10,
                  // top: marker.screenPosition.y  - 300,
                }}
                onDragStart={(e) => handleDragStart(e, marker)}
              >
                <img src={marker.icon} alt={marker.name} />
              </div>
            ))} */}
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

      <AddIcon
        isAddIcon={isAddIcon}
        />

      </div>

    
  );
};

export default AddMarker