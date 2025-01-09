// archiveRoutes.js

const express = require('express');
const { archiveField , archiveDocument , archiveMarkerIcon } = require('../utility/archiveUtils');
const Card = require('../models/Cards');  // Assuming you're using a Card model
const Modal = require('../models/Modal');
const Audio = require('../models/Audio');
const User = require('../models/User');
const NewsEvent = require('../models/NewsEvent');
const AboutUs = require('../models/AboutUs');
const Archive = require('../models/Archive');
const MarkerIcon = require('../models/MarkerIcon');



const router = express.Router();

// Get  10 archived items (limited)
router.get('/archivesData', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not specified
  try {
      const archives = await Archive.find()
          .sort({ archivedAt: -1 })
          .limit(limit);
      res.status(200).json(archives);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching archives', error });
  }
});

// Archive card image by ID
router.put('/cards/:id', async (req, res) => {
    const { imagePath } = req.body;  // Get imagePath from the request body
    console.log('Archive Route Hit:', req.params.id, imagePath);  // Log imageId and imagePath
  
    const card = await Card.findById(req.params.id);
  
    if (!card || !imagePath) {
      return res.status(404).json({ message: 'Image not found for archiving' });
    }
  
    console.log('Archiving image:', card.image, 'with path:', imagePath);
  
    // Proceed with archiving
    await archiveField('Cards', card._id, 'image', imagePath);
  
    card.image = null;
    card.imageArchived = true;
    await card.save();
  
    res.status(200).json({ message: 'Image archived successfully' });
  });


  // Archive modal image by ID
router.put('/modal/:id', async (req, res) => {
  const { imagePath } = req.body; // Get imagePath from the request body
  console.log('Archive Route for Modal Hit:', req.params.id, imagePath); // Log modalId and imagePath

  try {
    const modal = await Modal.findById(req.params.id);

    if (!modal || !imagePath) {
      return res.status(404).json({ message: 'Image or Modal not found for archiving' });
    }

    console.log('Archiving modal image:', imagePath, 'for modal ID:', modal._id);

    // Proceed with archiving
    await archiveField('Modal', modal._id, 'modalImages', imagePath);

    // Remove the archived image from the `modalImages` array
    modal.modalImages = modal.modalImages.filter((img) => img !== imagePath);

    // If no images are left, set `imageArchived` to true
    if (modal.modalImages.length === 0) {
      modal.imageArchived = true;
    }

    await modal.save();

    res.status(200).json({ message: 'Modal image archived successfully' });
  } catch (error) {
    console.error('Error archiving modal image:', error);
    res.status(500).json({ error: 'Failed to archive modal image' });
  }
});

// Archive audio by ID
router.put('/audio/:id', async (req, res) => {
  const { audioFilePath } = req.body;  // Get audioFilePath from the request body
  const audio = await Audio.findById(req.params.id);

  if (!audio || !audioFilePath) {
    return res.status(404).json({ message: 'Audio file not found for archiving' });
  }

  console.log('Archiving audio:', audio.filePath, 'with path:', audioFilePath);

  // Archive the audio file
  try {
    await archiveField('Audio', audio._id, 'filePath', audioFilePath);  // Archive the audio file

    // Update the audio document to mark it as archived
    audio.audioArchived = true;
    audio.originalName = "";
    audio.format = null;
    audio.filePath = null;  // Optionally, remove filePath if you no longer want to store it
    await audio.save();

    res.status(200).json({ message: 'Audio archived successfully' });
  } catch (error) {
    console.error('Error archiving audio:', error);
    res.status(500).json({ message: 'Error archiving audio' });
  }
});

// PUT route to archive an image and its associated data by filename
router.put('/newsEvent/image/:filename', async (req, res) => {
  const { filename } = req.params; // Extract filename from URL params
  console.log('Archiving NewsEvent image:', filename);

  try {
      // Find the NewsEvent document containing the images array
      const newsEvent = await NewsEvent.findOne();
      if (!newsEvent) {
          return res.status(404).json({ message: 'NewsEvent document not found' });
      }

      console.log('Images in NewsEvent:', newsEvent.images);

      // Check if the image exists in the array
      const imageIndex = newsEvent.images.indexOf(filename);
      if (imageIndex === -1) {
          return res.status(404).json({ message: 'Image not found for archiving' });
      }

      // Use the archive utility to move the image to the archive folder
      await archiveField('NewsEvent', newsEvent._id, 'images', filename);

      // Remove the image, header, and description at the same index
      newsEvent.images.splice(imageIndex, 1); // Remove image
      if (newsEvent.newsHeader) {
          newsEvent.newsHeader.splice(imageIndex, 1); // Remove corresponding header (null or value)
      }
      if (newsEvent.description) {
          newsEvent.description.splice(imageIndex, 1); // Remove corresponding description (null or value)
      }

      // Check if the images array is empty, then set imageArchived to true
      if (newsEvent.images.length === 0) {
          newsEvent.imageArchived = true;
      }

      // Save the updated NewsEvent document
      await newsEvent.save();

      res.status(200).json({ message: 'Image and associated data archived successfully' });
  } catch (error) {
      console.error('Error during NewsEvent image archiving:', error);
      res.status(500).json({ error: error.message });
  }
});



// Archive AboutUs image
router.put('/aboutUs', async (req, res) => {
  const { imagePath } = req.body;
  console.log('Archive AboutUs Image Hit:', imagePath);

  try {
    // Find the single AboutUs document
    const aboutUs = await AboutUs.findOne();

    if (!aboutUs) {
      return res.status(404).json({ message: 'AboutUs document not found' });
    }

    // Check if the provided image matches
    if (aboutUs.image !== imagePath) {
      return res.status(400).json({ message: 'Provided image path does not match' });
    }

    // Archive the image and update the document
    const archivedImagePath = await archiveField('AboutUs', aboutUs._id, 'image', imagePath); // Ensure using _id
    aboutUs.image = null; // Set the image field to null
    aboutUs.isArchived = true; // Add an archive flag if needed

    await aboutUs.save();
    res.status(200).json({ message: 'Image archived successfully', archivedImagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Archive MarkerIcon document data by Id
router.put('/markerIcon/:id', async (req, res) => {
  try {
    const markerIconId = req.params.id;
    await archiveMarkerIcon(markerIconId);
    res.status(200).json({ message: 'MarkerIcon archived successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving MarkerIcon', error });
  }
});




// Archive a user account by ID
router.put('/user/:id', async (req, res) => {
  const { id } = req.params;  // Get the user ID from the request params

  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found for archiving' });
      }

      console.log('Archiving user account:', user);

      // Archive the user account
      await archiveDocument('User', user._id, user.toObject());

      res.status(200).json({ message: 'User account archived successfully' });
  } catch (error) {
      console.error('Error during user account archiving:', error);
      res.status(500).json({ error: error.message });
  }
});



module.exports = router;
