import * as THREE from 'three';
import icon from '../barn.png';
import img from '../images/farm.jpg';

const markerData = [
    { position: new THREE.Vector3(30, 52, 0), icon: icon, name: 'Dragon Fruit Farm', img: img, description: 'An area where 276 vibrant red dragon fruit plants thrive. Every plant is tended to tender care, ensuring they receive just the right amount of sunlight, water, and nutrients to grow.' },
    { position: new THREE.Vector3(0, 0, 0), icon: icon, name: 'Marker 2', img: img, description: 'Marker 2 description' },
    { position: new THREE.Vector3(10, -5, 0), icon: icon, name: 'Marker 3', img: img, description: 'Marker 3 description' },
  ];

export default markerData;