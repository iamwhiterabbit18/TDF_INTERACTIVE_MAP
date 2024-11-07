import React, { useEffect, useRef ,useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import Experience from './Components/Experience';
import Markers from './Components/marker/Markers';
import Preloader from '../preloader/Preloader';

import styles from '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss';
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component

import NavigationModule from '../navBar/NavigationModule';

import Shhhh from '../virus/Shhhh';

import { useAuth } from '/src/Pages/Admin/ACMfiles/AuthContext'; // Adjust the path accordingly
import { useNavigate } from 'react-router-dom';

const ThreeCanvas = () => {
  
  const location = useLocation();
  const user = location.state?.user;

  const containerRef = useRef(null);
  const expRef = useRef(null);
  // here
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneAndCamera, setSceneAndCamera] = useState(null);

  const dogsRef = useRef([]);
  

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const exp = new Experience(container);
      expRef.current = exp;
      const scene = exp.scene;
      sceneRef.current = scene;

      const camera = exp.camera;
      cameraRef.current = camera;

      const renderer = exp.renderer;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = exp.controls;
      controlsRef.current = controls;
      
      setSceneAndCamera({scene, camera});

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        if (dogsRef.current.length > 0) {
          dogsRef.current.forEach(dog => {
              dog.rotation.x += 0.1;
              dog.rotation.y += 0.1;
          });
      }

        renderer.render(scene, camera);
        camera.updateMatrixWorld();
        
      };
      animate();

      const handleResize = () => {
        renderer.onWindowResize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }
  }, []);

  const moveToMarker = (markerPosition, onComplete) => {
    if (controlsRef.current && cameraRef.current && sceneRef.current && rendererRef.current) {
      try {
        const targetPosition = new THREE.Vector3(markerPosition.x, controlsRef.current.target.y, markerPosition.z);
        console.log("target pos", targetPosition)

        const startTarget = controlsRef.current.target.clone();
        const startPosition = cameraRef.current.position.clone();
    
        const cameraOffset = startPosition.clone().sub(startTarget);
    
        let progress = 0;
    
        const animateCamera = () => {
          if (progress < 1) {
            progress += 0.02; // Adjust speed here
  
            controlsRef.current.target.lerpVectors(startTarget, targetPosition, progress);
            
            cameraRef.current.position.copy(controlsRef.current.target).add(cameraOffset);
  
            controlsRef.current.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
  
            requestAnimationFrame(animateCamera);
            // console.log('progress is finished', progress);
          }
          else if (progress >= 1) {
            if (onComplete) {
              onComplete();
            }
          }
        };

        // Start the animation
        animateCamera();
      } catch (error) {
        console.error('Error in moveToMarker:', error);
      }
    } else {
      console.warn('Some required references are null in moveToMarker');
    }
    
  };



  return(
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
    
    <NavigationModule user={user}/>

      <Preloader />
      {sceneAndCamera && (
        <Markers
        scene={sceneAndCamera.scene}
        camera={sceneAndCamera.camera}
        container={containerRef.current}
        moveToMarker={moveToMarker}
      />
      )}
      {/* {sceneAndCamera &&(
        <Shhhh renderer={rendererRef.current} scene={sceneAndCamera.scene} camera={sceneAndCamera.camera} dogsRef={dogsRef} />
      )}
      */}
    </div>
  ) 
};

export default ThreeCanvas;
