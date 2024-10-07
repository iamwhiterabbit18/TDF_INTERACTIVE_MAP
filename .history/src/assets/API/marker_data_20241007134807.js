import * as THREE from 'three';
import get from './get';
import icon from '../barn.png';
import img from '../images/farm.jpg';
import axios from 'axios'; // Import axios for API calls


const data = () => get();



/*const markerData = [
    { position: new THREE.Vector3(30, 52, 0), icon: icon, name: 'Dragon Fruit Farm', img: img, description: 'An area where 276 vibrant red dragon fruit plants thrive. Every plant is tended to tender care, ensuring they receive just the right amount of sunlight, water, and nutrients to grow.' },
    { position: new THREE.Vector3(0, 0, 0), icon: icon, name: 'Marker 2', img: img, description: 'Marker 2 description' },
   { position: new THREE.Vector3(10, -5, 0), icon: icon, name: 'Marker 3', img: img, description: 'Marker 3 description' },
  ]; */

// Define area positions areaName should same case in DB do define properly (watch for naming)
const areaPositions = {
  'Feathered Place': new THREE.Vector3(1.57,-0.1, 0),
  'Extension Hall': new THREE.Vector3(1.57, 0.17, 0),
  'Bahay Kubo': new THREE.Vector3(1.75, 0.3, 0),
  'House of Greens': new THREE.Vector3(1.6, 0.45, 0),
  'Urban Garden': new THREE.Vector3(1.65,0.85, 0),
  'GuestHouse': new THREE.Vector3(1.32,0.9, 0),
  'Fish/Prawn Culture': new THREE.Vector3(2.88,0.95, 0),
  'Agri-Eco Park Main Building': new THREE.Vector3(1.5, 1.45, 0),
  'Birds Paradise': new THREE.Vector3(1.2, 1.45, 0),
  'Poultry Village': new THREE.Vector3(0.9, 1.15, 0),
  'Native Organics': new THREE.Vector3(0.96, 0.85, 0),
  'Garden Scape': new THREE.Vector3(1.22, 0.55, 0),
  'Green Haven': new THREE.Vector3(1.15, 0.33, 0),
  'Herb Land': new THREE.Vector3(1.35, 0.29, 0),
  'Healing Garden': new THREE.Vector3(1.35, 0.4, 0),
  'Bee Program Demo Site': new THREE.Vector3(-2, -1.80, 0),
  'Nursery': new THREE.Vector3(3.5, 1.5, 0),
  'Theatre': new THREE.Vector3(3.5, 1, 0),
};


const fetchMarkerData = async () => {
  try {
      const response = await axios.get('http://localhost:5000/api/cards');

        // Fetch modal data
    const modalResponse = await axios.get('http://localhost:5000/api/modal'); // Adjust the endpoint as needed
    const modals = modalResponse.data;

      console.log('Fetched cards:', response.data); // Log fetched cards
    console.log('Fetched modals:', modals); // Log fetched modals

    // Map modals to a quick access structure
    const modalMap = {};
    modals.forEach(modal => {
      modalMap[modal._id] = modal; // Assuming _id is the modal ID
    });

      return response.data.map(card => {
          // Normalize the area name
          const normalizedAreaName = card.areaName.trim(); // No lowercase conversion for exact match
          const position = areaPositions[normalizedAreaName] || new THREE.Vector3(0, 0, 0); // Default position

          console.log(`Marker for ${card.areaName}:`, position); // Log the position

          return {
              position: position,
              icon: icon,
              name: card.areaName,
              img: `http://localhost:5000${card.image}`,
              quickFacts: card.quickFacts,
              modalId: card.card_id,
          };
      });
  } catch (error) {
      console.error('Error fetching marker data:', error);
      return [];
  }
};

export default fetchMarkerData;