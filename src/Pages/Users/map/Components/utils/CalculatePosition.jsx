import * as THREE from 'three';

const calculatePosition = (screenPosition, camera, container) => {

  // const position = worldPosition instanceof THREE.Vector3 
  //   ? worldPosition 
  //   : new THREE.Vector3(worldPosition.x, worldPosition.y, worldPosition.z);
  // console.log("Position: ", position)
  // const screenPosition = position.clone().project(camera);
  


  const normalizedX = (screenPosition.x / container.clientWidth) * 2 - 1;
  const normalizedY = -(screenPosition.y / container.clientHeight) * 2 + 1;

  const vector = new THREE.Vector3(normalizedX, 0.5, normalizedY);
  vector.unproject(camera);

  return vector;

};

export default calculatePosition;