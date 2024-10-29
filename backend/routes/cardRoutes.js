// routes/cardRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Card = require('../models/Cards');


// Set up multer storage configuration for file uploads
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads/' directory
  },
  // Generate a unique filename for the uploaded file using the current timestamp
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Prepend timestamp to the original filename
  }
});

// File filter function to allow only specific image formats
const fileFilter = (req, file, cb) => {
  // Allowed extensions: jpeg, png, gif
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only .jpeg, .png, and .gif formats are allowed!'), false); // Reject the file
  }
};

// Initialize multer with the defined storage configuration and file size limit (10MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get a specific card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id); // Fetch card by ID

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a card by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  console.log('Updating card with ID:', req.params.id);
  try {
    const card = await Card.findById(req.params.id); // Find card by ID
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const { areaName, quickFacts } = req.body;
    const newImage = req.file ? `/uploads/${req.file.filename}` : card.image; // New image if uploaded

    // Only delete the old image if a new one is uploaded and they are different
    if (req.file && card.image && newImage !== card.image) {
      const oldImagePath = path.join(__dirname, '..', card.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image file
      }
    }

    // Update card fields
    card.areaName = areaName; // Update area name
    card.quickFacts = quickFacts; // Update quick facts
    if (newImage) card.image = newImage; // Update image path if new image is uploaded

    await card.save(); // Save the updated card

    res.json({ message: 'Card updated successfully', card });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Server error while updating card' });
  }
});

// Export the router
module.exports = router;
