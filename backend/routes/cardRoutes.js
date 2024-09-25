// routes/cardRoutes.js

// Import necessary dependencies
const express = require('express');    // Express framework for handling routes
const multer = require('multer');      // Multer for handling file uploads
const path = require('path');          // Path module for working with file paths
const Card = require('../models/Card'); // Importing the Card model to interact with the database
const fs = require('fs'); // Import the filesystem module for file operations
const router = express.Router();       // Creating an Express router to define routes

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

// Initialize multer with the defined storage configuration
const upload = multer({ storage });

// Route to fetch card data from the database
router.get('/', async (req, res) => {
  try {
    // Find one card from the Card collection
    const card = await Card.findOne();
    
    // If no card is found, respond with a 404 error
    if (!card) return res.status(404).json({ error: 'No card found' });
    
    // Send the card data as a JSON response
    res.json(card);
  } catch (error) {
    // Handle any server errors and respond with a 500 status code
    res.status(500).json({ error: 'Server error while fetching card' });
  }
});

// Route to update card data and handle file uploads
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },        // Upload one image file for the 'image' field
  { name: 'weatherIcon', maxCount: 1 }   // Upload one image file for the 'weatherIcon' field
]), async (req, res) => {
  try {
    const { areaName, weather, quickfacts } = req.body;
    const newImage = req.files?.image ? `/uploads/${req.files.image[0].filename}` : '';
    const newWeatherIcon = req.files?.weatherIcon ? `/uploads/${req.files.weatherIcon[0].filename}` : '';

    let card = await Card.findOne();

    if (card) {
      // Delete the old image if a new one is uploaded
      if (newImage && card.image) {
        fs.unlinkSync(path.join(__dirname, '..', card.image)); // Remove old image
      }
      // Delete the old weather icon if a new one is uploaded
      if (newWeatherIcon && card.weatherIcon) {
        fs.unlinkSync(path.join(__dirname, '..', card.weatherIcon)); // Remove old weather icon
      }

      // Update card fields
      card.areaName = areaName;
      card.weather = weather;
      card.quickfacts = quickfacts;
      if (newImage) card.image = newImage;
      if (newWeatherIcon) card.weatherIcon = newWeatherIcon;
      
      await card.save();
    } else {
      // If no card exists, create a new one
      card = new Card({
        areaName,
        weather,
        quickfacts,
        image: newImage,
        weatherIcon: newWeatherIcon
      });
      await card.save();
    }

    res.json({ message: 'Card updated successfully' });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Server error while updating card' });
  }
});

// Export the router to make the routes available in the main app
module.exports = router;
