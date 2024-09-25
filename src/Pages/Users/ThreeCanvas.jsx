import React, { useEffect, useRef ,useState } from 'react';
import * as THREE from 'three';
import Experience from '../../Components/Experience';
import Markers from '../../Components/marker/Markers';

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
      camera.position.z = 50;
      cameraRef.current = camera;

      const renderer = exp.renderer;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = exp.controls;
      controlsRef.current = controls;

      // tes pos

      // function getClickPosition(event, camera, scene) {
      //   const raycaster = new THREE.Raycaster();
      //   const mousePosition = new THREE.Vector2();
      
      //   mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      //   mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      //   raycaster.setFromCamera(mousePosition, camera);
      //   const intersects = raycaster.intersectObjects(scene.children, true);
      
      //   if (intersects.length > 0) {
      //     return intersects[0].point;
      //   } else {
      //     return null;
      //   }
      // }
      // document.addEventListener('click', (event) => {
      //   const clickPosition = getClickPosition(event, camera, scene);
      //   if (clickPosition) {
      //     console.log(clickPosition);
      //   }
      // });

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
  const moveToMarker = (markerPosition, onComplete) => {
    if (controlsRef.current && cameraRef.current && sceneRef.current && rendererRef.current) {
      try {
        const targetPosition = new THREE.Vector3(markerPosition.x, markerPosition.y, controlsRef.current.target.z);
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
