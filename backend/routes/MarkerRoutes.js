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

    // Validate that all required fields are provided
    if (!areaName || !worldPosition || !iconType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 1: Create the Audio document
    const newAudio = new Audio({
      title: `${areaName}`, // Use areaName for Audio title
      originalName: "",
    });
    const savedAudio = await newAudio.save({ session });

    // Step 2: Create the Modal document
    const newModal = new Modal({
      audio_id: savedAudio._id, // Reference the Audio document
      title: `${areaName} `, // Use areaName for Modal title
      description: `Description of ${areaName}`,
      technologies: `Technologies used in ${areaName}`,
    });
    const savedModal = await newModal.save({ session });

    // Step 3: Create the Card document
    const newCard = new Card({
      modal_id: savedModal._id, // Reference the Modal document
      areaName, // Use areaName for Card areaName field
      quickFacts: `Quick facts about ${areaName}`,
      iconType: `${iconType}`,
    });
    const savedCard = await newCard.save({ session });

    // Step 4: Create the Marker document
    const newMarker = new Marker({
      areaName, 
      worldPosition, 
      iconType,
      card: savedCard._id,   // Store reference to the related Card
      modal: savedModal._id, // Store reference to the related Modal
      audio: savedAudio._id, // Store reference to the related Audio
    });
    const savedMarker = await newMarker.save({ session });

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
    const markers = await Marker.find({}).populate('card modal audio');
    res.status(200).json(markers);
  } catch (err) {
    console.error('Error fetching markers:', err);
    res.status(500).json({ message: 'Error fetching markers' });
  }
});

router.delete('/:id', async (req, res) => {
  const markerId = req.params.id;

  try {
    // Find the marker
    const marker = await Marker.findById(markerId);
    if (!marker) {
      return res.status(404).json({ message: 'Marker not found' });
    }

    // Conditional deletion of related documents
    const deleteOperations = [];
    if (marker.card) deleteOperations.push(Card.findByIdAndDelete(marker.card));
    if (marker.modal) deleteOperations.push(Modal.findByIdAndDelete(marker.modal));
    if (marker.audio) deleteOperations.push(Audio.findByIdAndDelete(marker.audio));

    await Promise.all(deleteOperations);

    // Delete the marker itself
    await Marker.findByIdAndDelete(markerId);

    res.status(200).json({ message: 'Marker and related documents deleted successfully' });
  } catch (err) {
    console.error('Error deleting marker:', err);
    res.status(500).json({ message: 'Error deleting marker and related documents', error: err.message });
  }
});

// Update marker and related documents
router.put('/:id', async (req, res) => {
  const markerId = req.params.id;
  const { areaName, iconType } = req.body;

  try {
    // Find the marker by its ID
    const marker = await Marker.findById(markerId);
    if (!marker) {
      return res.status(404).json({ message: 'Marker not found' });
    }

    // Only update areaName if it's provided (not empty or undefined)
    if (areaName) {
      marker.areaName = areaName;
    }

    // Only update iconType if it's provided and is not an empty string
    if (iconType && iconType !== "") {
      marker.iconType = iconType;
    }

    // Save the updated marker
    await marker.save();

    // Update related documents (Card, Modal, Audio) if needed
    if (marker.card) {
      await Card.findByIdAndUpdate(marker.card, {
        areaName,
        ...(iconType && iconType !== "" && { iconType }) // Only update iconType if valid
      });
    }

    if (marker.modal) {
      await Modal.findByIdAndUpdate(marker.modal, { title: areaName });
    }

    if (marker.audio) {
      await Audio.findByIdAndUpdate(marker.audio, { title: areaName });
    }

    res.status(200).json({ message: 'Marker and related documents updated successfully' });
  } catch (err) {
    console.error('Error updating marker:', err);
    res.status(500).json({ message: 'Error updating marker and related documents' });
  }
});



module.exports = router;
