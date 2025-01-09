const express = require('express');
const multer = require('multer');
const MarkerIcon = require('../models/MarkerIcon'); // Assuming a MarkerIcon model exists
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Multer storage configuration for marker icons
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/icons'); // Set the folder for marker icon uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Filename format
  },
});

// Multer configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files (png, jpeg, jpg, svg) are allowed!'));
    }
    cb(null, true);
  },
});


// Fetch all marker icons
router.get('/', async (req, res) => {
    try {
      const icons = await MarkerIcon.find();
      res.status(200).json(icons);
    } catch (err) {
      console.error('Error fetching marker icons:', err);
      res.status(500).json({ error: 'Error fetching marker icons' });
    }
  });

  // Fetch a specific marker icon by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const icon = await MarkerIcon.findById(id);
      if (!icon) {
          return res.status(404).json({ error: 'Marker icon not found' });
      }
      res.status(200).json(icon);
  } catch (err) {
      console.error('Error fetching marker icon:', err);
      res.status(500).json({ error: 'Error fetching marker icon' });
  }
});

 // POST route for creating a new marker icon
router.post('/Icon', upload.single('icon'), async (req, res) => {
  const { name } = req.body; // Marker name
  const uploadedFile = req.file;

  try {
    // Validate that both name and uploaded file are provided
    if (!name || !uploadedFile) {
      throw new Error('Name and icon are required.');
    }
    
     // Save only the filename in the database (e.g., '1735500439170-wheat.png')
     const iconFileName = path.basename(uploadedFile.path);

    // Save only the filename in the database
    const newMarkerIcon = new MarkerIcon({
      name,
      iconPath: iconFileName, // Store just the filename
    });

    // Save the new MarkerIcon document to the database
    await newMarkerIcon.save();

    res.status(201).json({
      message: 'New marker icon created successfully!',
      data: newMarkerIcon,
    });
  } catch (error) {
    console.error('Error in creating marker icon:', error.message);
    res.status(500).json({ error: error.message || 'Error creating marker icon' });
  }
});



// PUT route for adding/updating marker icon
router.put('/Icon/:id', upload.single('icon'), async (req, res) => {
  const { id } = req.params; // MarkerIcon ID
  const { name } = req.body; // Additional fields
  const uploadedFile = req.file;

  try {
    // Find the MarkerIcon document by ID
    let markerIcon = await MarkerIcon.findById(id);

    if (!markerIcon) {
      // If not found, create a new document
      markerIcon = new MarkerIcon({ _id: id });
    }

    // Update the name if provided
    if (name) {
      markerIcon.name = name;
    } else if (!markerIcon.name) {
      throw new Error('Name is required');
    }

    // If a new icon file is uploaded
    if (uploadedFile) {
      // Delete the old icon file if it exists
      if (markerIcon.iconPath) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', 'icons', markerIcon.iconPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Remove the old file
        }
      }

      // Save only the filename in the database
      markerIcon.iconPath = path.basename(uploadedFile.path);
    } 

    // Save the updated or new MarkerIcon document
    await markerIcon.save();

    res.status(200).json({
      message: 'Marker icon updated successfully',
      data: markerIcon,
    });
  } catch (error) {
    console.error('Error in marker icon route:', error.message);
    res.status(500).json({ error: error.message || 'Error updating marker icon' });
  }
});


  // Delete a marker icon
  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const icon = await MarkerIcon.findById(id);
      if (!icon) return res.status(404).json({ error: 'Marker icon not found' });
  
      const filePath = path.join(__dirname, '..', 'uploads', 'icons', icon.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Remove the file
      }
  
      await MarkerIcon.findByIdAndDelete(id); // Delete the database record
      res.status(200).json({ message: 'Marker icon deleted successfully!' });
    } catch (err) {
      console.error('Error deleting marker icon:', err);
      res.status(500).json({ error: 'Error deleting marker icon' });
    }
  });
  

module.exports = router;
