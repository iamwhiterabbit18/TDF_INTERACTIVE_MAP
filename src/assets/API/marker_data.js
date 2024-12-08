import * as THREE from 'three';
import get from './get';
import assets from '@assets/Icon.js'
import img from '../images/farm.jpg';
import axios from 'axios'; // Import axios for API calls


const data = () => get();
const icon = assets.marker;
{/*
// Define area positions areaName should same case in DB do define properly (watch for naming)
const areaPositions = {

 'Feathered Place': new THREE.Vector3(1.60, 0.07, 0.43),
  'Extension Hall': new THREE.Vector3(1.65, 0.07, 0.04),
  'Bahay Kubo': new THREE.Vector3(1.79, 0.07, -0.15),
  'House of Greens': new THREE.Vector3(1.63, 0.18, -0.34),
  'Urban Garden': new THREE.Vector3( 1.44, 0.08, -0.63),
  'GuestHouse': new THREE.Vector3(1.46, 0.08, -0.93),
  'Fish/Prawn Culture': new THREE.Vector3(2.84, 0.07, -1.03),
  'Agri-Eco Park Main Building': new THREE.Vector3( 1.49, 0.08, -1.25),
  'Birds Paradise': new THREE.Vector3(1.21,  0.07, -1.36),
  'Poultry Village': new THREE.Vector3(1.01, 0.07, -1.16),
  'Native Organics': new THREE.Vector3(1.06, 0.07, -0.79),
  'Garden Scape': new THREE.Vector3(1.20, 0.11, -0.56),
  'Green Haven': new THREE.Vector3(1.11, 0.16, -0.40),
  'Herb Land': new THREE.Vector3(1.29, 0.07, -0.40),
  'Healing Garden': new THREE.Vector3(1.28, 0.09, -0.31),
  'Bee Program Demo Site': new THREE.Vector3(-1.87, 0.12,1.69),
  'Theatre': new THREE.Vector3(-0.02, 0.08, -0.09),
  'Nursery': new THREE.Vector3(-2.56, 0.08, 1.48),
  // 'AmpiTheatre': new THREE.Vector3(-1.80, 0.08, 0.57), 


}; */}

//let areaPositions = {}; // Declare areaPositions outside the fetch function
const fetchMarkerData = async () => {
  let areaPositions = {};  // Declare areaPositions inside the function

  try {
    const response = await axios.get('http://localhost:5000/api/cards');
    
    // Fetch marker data to populate areaPositions
    const markerResponse = await axios.get('http://localhost:5000/api/markers/markerData'); // Adjust URL if needed
    const markers = markerResponse.data;

    // Populate areaPositions using markers data
    markers.forEach(marker => {
      areaPositions[marker.areaName] = new THREE.Vector3(
        marker.worldPosition.x,
        marker.worldPosition.y,
        marker.worldPosition.z
      );
    });

    console.log('Updated areaPositions:', areaPositions); // Log the updated areaPositions

    // Fetch modal data
    const modalResponse = await axios.get('http://localhost:5000/api/modal'); // Adjust endpoint as needed
    const modals = modalResponse.data;
    console.log('Fetched modals:', modals);

    // Map modals to a quick access structure
    const modalMap = {};
    modals.forEach(modal => {
      modalMap[modal._id] = modal; // Assuming _id is the modal ID
    });

    return response.data.map(card => {
      console.log('Processing card:', card); // Check if map is running for each card
      const normalizedAreaName = card.areaName.trim(); // No lowercase conversion for exact match
      const position = areaPositions[normalizedAreaName] || new THREE.Vector3(0, 0, 0); // Default position
      console.log('Marker position for', normalizedAreaName, ':', position);

      return {
        position: position,
        icon: `${icon[card.iconType]}`,
        name: card.areaName,
        img: `http://localhost:5000/uploads/cardsImg/${card.image}`,
        quickFacts: card.quickFacts,
        modalId: card.modal_id,
      };
    });
  } catch (error) {
    console.error('Error fetching marker data:', error);
    return [];
  }
};


export default fetchMarkerData;