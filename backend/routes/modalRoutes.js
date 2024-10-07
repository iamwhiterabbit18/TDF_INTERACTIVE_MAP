// Import necessary modules
const express = require('express');
const multer = require('multer');   // Used for handling file uploads
const path = require('path');       // Used to manage file paths
const Modal = require('../models/Modal');  // Import the Modal model
const fs = require('fs');
const router = express.Router();     // Initialize Express router

// Set up multer storage for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set upload directory to 'uploads/'
    cb(null, 'uploads/modalImages');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original name and a timestamp
    const originalName = file.originalname; // Get the original file name
    const fileExtension = path.extname(originalName); // Extract the file extension
    const baseName = path.basename(originalName, fileExtension); // Get file name without extension
    
    // Create a new filename with a timestamp to avoid conflicts
    const newFileName = `modalImages-${Date.now()}-${baseName}${fileExtension}`;
    
    // Save the new filename
    cb(null, newFileName);
  }
});

// Set file filtering for allowed image types (JPEG and PNG)
const fileFilter = (req, file, cb) => {
  // Define allowed file types using regex
  const allowedTypes = /jpeg|jpg|png/;
  // Check both file extension and MIME type
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  // If both extension and MIME type are valid, accept the file
  if (mimetype && extname) {
    return cb(null, true);
  }
  // Reject the file if it's not an accepted format
  cb(new Error('Unsupported file format'));
};

// Set up multer for file uploads with filters and file size limit
const upload = multer({
  storage: storage,  // Use the storage settings defined above
  fileFilter: fileFilter,  // Apply the file filter function
  limits: { fileSize: 1024 * 1024 * 5 }  // Limit file size to 5MB
});

/*Get modal by areaName
router.get('/modal/:areaName', async (req, res) => {
  try {
    const modal = await Modal.findOne({ title: new RegExp('^' + req.params.areaName + '$', 'i') });
    if (!modal) {
      return res.status(404).json({ message: 'Modal not found' });
    }
    res.json(modal);
  } catch (error) {
    console.error('Error fetching modal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); */

// Get modal by ID
router.get('/modal/:id', async (req, res) => {
  try {
    const modal = await Modal.findById(req.params.id);
    if (!modal) {
      return res.status(404).json({ message: 'Modal not found' });
    }
    res.status(200).json(modal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Get all modal data
router.get('/modal', async (req, res) => {
  try {
    const modals = await Modal.find(); // Fetch all modals
    res.json(modals);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching modals' });
  }
});



router.put('/modal/:id', upload.fields([{ name: 'modalImages' }]), async (req, res) => {
  const { id } = req.params;
  const { description } = req.body; 
  const uploadedFiles = req.files.modalImages || []; 

  try {
      const modal = await Modal.findById(id);
      if (!modal) {
          return res.status(404).json({ message: 'Modal not found' });
      }

      const oldImages = modal.modalImages; // Get the existing images from the modal

      // Delete old images if new ones are uploaded
      oldImages.forEach((oldImage, index) => {
          if (uploadedFiles[index] && oldImage) {
              const oldImagePath = path.join(__dirname,'..', 'uploads', 'modalImages', oldImage);
              console.log(`Attempting to delete old image at: ${oldImagePath}`);

              if (fs.existsSync(oldImagePath)) {
                  fs.unlinkSync(oldImagePath); 
                  console.log(`Deleted old image: ${oldImagePath}`);
              } else {
                  console.warn(`File not found: ${oldImagePath}`);
              }
          }
      });

      // Update the description
      modal.description = description;

      // Update modalImages if any files were uploaded
      if (uploadedFiles.length > 0) {
          const filenames = uploadedFiles.map(file => file.filename);
          modal.modalImages = filenames; // Update modalImages with new filenames
      }

      // Save the updated modal
      const updatedModal = await modal.save();

      res.status(200).json(updatedModal);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});






module.exports = router;  // Export the router for use in the main app
