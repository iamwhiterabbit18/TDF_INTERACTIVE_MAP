import React, { useEffect, useRef ,useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import Experience from './Components/Experience';
import Markers from './Components/marker/Markers';
import Preloader from '../preloader/Preloader';

import DragAndScroll from '@utils/DragAndScroll'

import './ThreeCanvas.scss'; // global styles for the map
import styles1 from '/src/Pages/Users/landing/signInModule/AccessBtn.module.scss'; // this to be adjusted
import AccessBtn from '/src/Pages/Users/landing/signInModule/AccessBtn'; // Import the new AccessBtn component

import NavigationModule from '../navBar/NavigationModule';

import Shhhh from '../virus/Shhhh';

import { useAuth } from '/src/Pages/Admin/ACMfiles/AuthContext'; // Adjust the path accordingly
import { useNavigate } from 'react-router-dom';

// for pathfinding
import Pathfinding from './Components/pathfinding/Pathfinding';
import positions from '../../../assets/API/positions';
// import { exp } from 'three/webgpu';
// import { set } from 'mongoose';

const ThreeCanvas = () => {
  
  const location = useLocation();
  const user = location.state?.user;

  const containerRef = useRef(null);
  const mapContainerRef = useRef(null);
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
      const mapContainer = mapContainerRef.current
      const exp = new Experience(mapContainer);
      expRef.current = exp;
      const scene = exp.scene;
      sceneRef.current = scene;

      const camera = exp.camera;
      cameraRef.current = camera;

      const renderer = exp.renderer;
      mapContainer.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = exp.controls;
      controlsRef.current = controls;

      setSceneAndCamera({scene, camera});

      setPreloaderState(true);
  
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


  // for markers
  const moveToMarker = (markerPosition, onComplete) => {
    if (controlsRef.current && cameraRef.current && sceneRef.current && rendererRef.current && !isOnPF) {
      try {
        const targetPosition = new THREE.Vector3(markerPosition.x, controlsRef.current.target.y, markerPosition.z);
        console.log("target pos", targetPosition)

        const startTarget = controlsRef.current.target.clone();
        const startPosition = cameraRef.current.position.clone();
    
        const cameraOffset = startPosition.clone().sub(startTarget);
    
        let progress = 0;
    
        const animateCamera = () => {
          if (progress < 1) {
            console.log('this')
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

  // for pathfinding
  const [isOnPF, setIsOnPF] = useState(false);
  const [preloaderState, setPreloaderState] = useState(false);
  // pathfinding variables for map side positions
  const pfCameraPosition = new THREE.Vector3(-1.1274330022019352, 3.310487382990885, -0.033995582036357004);
  const pfCameraRotation = new THREE.Vector3(-1.5707953258627023, 0, 0);
  const pfControlsTarget = new THREE.Vector3(-1.1274330022019352, 3.4012858006496454e-8, -0.03399889560972315);

  const moveArrow = (startPos, targetPos) =>{
    if (expRef.current) {
      const path = expRef.current.map.pathfinding;  // Access the Path instance
      path.navigateToPosition(startPos, targetPos);      // Call moveArrow directly
    }
  }
  const removeLine = () =>{
    const path = expRef.current.map.pathfinding;
    path.dispose();
  }
  const getCurrentCamControls = (position, rotation, tar) => {
    let pos = position
    let rot = rotation
    let target = tar
    // initialCameraPositionRef.current = cameraRef.current.position.clone();
    // initialCameraRotationRef.current = cameraRef.current.rotation.clone();
    // initialControlsTargetRef.current = controlsRef.current.target.clone();

    return { pos, rot, target };
  }
  const [initialValues, setInitialValues] = useState({});
  const cameraPF = () => {
    if(!isOnPF){
    setIsOnPF(true);
    setInitialValues(getCurrentCamControls(cameraRef.current.position.clone(), cameraRef.current.rotation.clone(), controlsRef.current.target.clone()));

    // Go to pathfinding cam
    cameraRef.current.position.copy(pfCameraPosition);
    cameraRef.current.rotation.copy(pfCameraRotation);

    // Go to pathfinding target and disable controls
    controlsRef.current.target.copy(pfControlsTarget);
    controlsRef.current.update();
    controlsRef.current.enabled = false;
    }
    else if(isOnPF){
      console.log('obj', initialValues);
      setIsOnPF(false);
      // Reset camera position and rotation
      cameraRef.current.position.copy(initialValues.pos);
      cameraRef.current.rotation.copy(initialValues.rot);
      // Reset controls target
      controlsRef.current.target.copy(initialValues.target);
      controlsRef.current.update();
      controlsRef.current.enabled = true;
    }
  }
  const togglePathfinding = () => {
    const pathfinding = document.getElementById("pathfinding");
    const map = document.getElementById("mapCont");
    if (!pathfinding.classList.contains("active")) {
        pathfinding.classList.add("active");
        map.classList.add("shrink");

    } else {
        pathfinding.classList.remove("active");
        if (!map.classList.contains("active")) {
            map.classList.remove("shrink");
        }
    }
}

  return(
    <div id="container" ref={containerRef}>

      <NavigationModule user = { user }/>
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
      )} */}

        {/* Here will be the map be rendered */}
        <div ref={mapContainerRef} id="mapCont"></div>
        {/* pathfinding component */}
          <Pathfinding pos={positions} 
          // pass functions as props
          moveArrow={moveArrow} 
          removeLine={removeLine} 
          cameraPF={cameraPF}
          togglePathfinding={togglePathfinding} 
          getCurrentCamControls={getCurrentCamControls}
          />
    </div>
  ) 
};

export default ThreeCanvas;
