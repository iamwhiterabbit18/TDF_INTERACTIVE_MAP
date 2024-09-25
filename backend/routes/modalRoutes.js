// Import necessary modules
const express = require('express');
const multer = require('multer');   // Used for handling file uploads
const path = require('path');       // Used to manage file paths
const Modal = require('../models/Modal');  // Import the Modal model
const fs = require('fs');           // File system module for deleting old files

const router = express.Router();     // Initialize Express router

// Set up multer storage for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set upload directory to 'uploads/'
    cb(null, 'uploads/');
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

// GET route to retrieve modal data
router.get('/', async (req, res) => {
  try {
    const modal = await Modal.findOne();  // Retrieve one modal document from the database
    if (!modal) return res.status(404).json({ error: 'No modal data found' });  // Return 404 if no modal is found

    // Prepare the response with modal data (excluding empty values)
    const responseData = {
      modalTitle: modal.title || '',  // Fallback to empty string if title is missing
      modalDescription: modal.description || '',  // Fallback to empty string if description is missing
      modalImages: [
        modal.image1 || null,
        modal.image2 || null,
        modal.image3 || null,
        modal.image4 || null,
        modal.image5 || null
      ].filter(image => image)  // Remove any null or empty image fields
    };

    res.json(responseData);  // Send the modal data as JSON response
  } catch (error) {
    console.error('Error fetching modal data:', error);  // Log the error
    res.status(500).json({ error: 'Server error while fetching modal data' });  // Return server error
  }
});

// POST route to update or create modal data
router.post('/', upload.array('modalImages', 5), async (req, res) => {
  try {
    // Destructure the title and description from the request body
    const { modalTitle, modalDescription } = req.body;

    // Ensure title and description are present
    if (!modalTitle || !modalDescription) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    // Get file paths of uploaded images from multer
    const modalImages = req.files.map(file => file.path);

    // Check if a modal already exists in the database
    let modal = await Modal.findOne();

    // If no modal is found, create a new instance
    if (!modal) {
      modal = new Modal();
    }

    // Delete old images if new ones are uploaded
    const oldImages = [modal.image1, modal.image2, modal.image3, modal.image4, modal.image5];
    oldImages.forEach((oldImage, index) => {
      // If new image is uploaded and an old image exists, delete the old image
      if (modalImages[index] && oldImage) {
        fs.unlinkSync(path.join(__dirname, '..', oldImage));  // Remove old image from the filesystem
      }
    });

    // Update modal fields with new data
    modal.title = modalTitle;
    modal.description = modalDescription;
    modal.image1 = modalImages[0] || modal.image1;
    modal.image2 = modalImages[1] || modal.image2;
    modal.image3 = modalImages[2] || modal.image3;
    modal.image4 = modalImages[3] || modal.image4;
    modal.image5 = modalImages[4] || modal.image5;

    // Save the updated modal to the database
    await modal.save();

    // Send success message
    res.json({ message: 'Modal data saved successfully' });
  } catch (error) {
    console.error('Error saving modal data:', error);  // Log any errors
    res.status(500).json({ error: 'Server error while saving modal data' });  // Return server error response
  }
});

module.exports = router;  // Export the router for use in the main app
