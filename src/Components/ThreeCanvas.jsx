import React, { useEffect, useRef ,useState } from 'react';
import * as THREE from 'three';
import Experience from './Experience';
import Markers from '../Components/marker/Markers';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  // here
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneAndCamera, setSceneAndCamera] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const exp = new Experience(container);
      const scene = exp.scene;
      sceneRef.current = scene;

      const camera = exp.camera;
      camera.position.z = 20;
      cameraRef.current = camera;

      const renderer = exp.renderer;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = exp.controls;
      controlsRef.current = controls;
      

      // test cube
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      setSceneAndCamera({scene, camera});

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
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

  // TO STUDY!
  const tolerance = 1;
  const moveToMarker = (markerPosition, onComplete) => {
    if (controlsRef.current && cameraRef.current && sceneRef.current && rendererRef.current) {
      try {
        const targetPosition = new THREE.Vector3(markerPosition.x, markerPosition.y, controlsRef.current.target.z);
        console.log("target pos", targetPosition)
        // Start position and control target
        const startTarget = controlsRef.current.target.clone();
        const startPosition = cameraRef.current.position.clone();
    
        // Calculate the offset between camera and controls target
        const cameraOffset = startPosition.clone().sub(startTarget);
    
        // Animation parameters
        const duration = 1.5; // in seconds
        let progress = 0;
    
        const animateCamera = () => {
          if (progress < 1) {
            progress += 0.02; // Adjust speed here
  
            // Interpolate the controls target (which controls panning)
            controlsRef.current.target.lerpVectors(startTarget, targetPosition, progress);
            
            // Maintain camera offset to keep the distance constant
            cameraRef.current.position.copy(controlsRef.current.target).add(cameraOffset);
  
            // Update controls and render the scene
            controlsRef.current.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
  
            // Request the next frame
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
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {sceneAndCamera && (
        <Markers
        scene={sceneAndCamera.scene}
        camera={sceneAndCamera.camera}
        container={containerRef.current}
        moveToMarker={moveToMarker}
      />
      )}
    </div>
  ) 
};

export default ThreeCanvas;
