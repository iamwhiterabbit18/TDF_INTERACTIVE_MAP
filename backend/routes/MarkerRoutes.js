const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Marker = require('../models/Marker');
const Card = require('../models/Cards');
const Modal = require('../models/Modal');
const Audio = require('../models/Audio');

// Route to save a new marker
// Route to save a new marker and create related documents
router.post('/addMarker', async (req, res) => {
    const session = await mongoose.startSession(); // Start a session for the transaction
    session.startTransaction();
  
    try {
      const { areaName, worldPosition, iconType } = req.body;
  
      if (!areaName || !worldPosition || !iconType) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Step 1: Create the Marker
      const newMarker = new Marker({ areaName, worldPosition, iconType });
      const savedMarker = await newMarker.save({ session });
  
      // Step 2: Create the Audio document
      const newAudio = new Audio({
        title: `${areaName}`, // Use areaName for Audio title
        originalName: "",
      });
      const savedAudio = await newAudio.save({ session });
  
      // Step 3: Create the Modal document
      const newModal = new Modal({
        audio_id: savedAudio._id, // Reference the Audio document
        title: `${areaName} `, // Use areaName for Modal title
        description: `Description of ${areaName}`,
        technologies: `Technologies used in ${areaName}`,
      });
      const savedModal = await newModal.save({ session });
  
      // Step 4: Create the Card document
      const newCard = new Card({
        modal_id: savedModal._id, // Reference the Modal document
        areaName, // Use areaName for Card areaName field
        quickFacts: `Quick facts about ${areaName}`,
        iconType: `${iconType}`,
      });
      const savedCard = await newCard.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      // Return success response with all created documents
      res.status(201).json({
        message: 'Marker and related documents created successfully',
        marker: savedMarker,
        card: savedCard,
        modal: savedModal,
        audio: savedAudio,
      });
    } catch (error) {
      // Rollback transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

// Fetch all markers
router.get('/markerData', async (req, res) => {
    try {
      const markers = await Marker.find({});
      res.status(200).json(markers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching markers' });
    }
  });

module.exports = router;
