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



// Get modal by ID
router.get('/:id', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const modals = await Modal.find(); // Fetch all modals
    res.json(modals);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching modals' });
  }
});

router.post('/:id', upload.array('modalImages', 10), async (req, res) => {
  const { id } = req.params;
  const filenames = req.files.map(file => file.filename); // Array of filenames

  try {
    const modal = await Modal.findById(id);

    if (!modal) {
      return res.status(404).json({ message: 'Modal not found' });
    }

    // Ensure modalImages is initialized as an array
    if (!modal.modalImages) {
      modal.modalImages = [];
    }

    // Push the new image filenames to the modalImages array
    modal.modalImages.push(...filenames);

    // Save the updated modal document
    const updatedModal = await modal.save();

    res.status(200).json(updatedModal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});



router.put('/:id/updateImage', upload.single('modalImage'), async (req, res) => {
  const { id } = req.params;
  const { imageIndex } = req.body; // Get the index from the request
  const uploadedFile = req.file; // Get the new uploaded image

  try {
    const modal = await Modal.findById(id);
    if (!modal) {
      return res.status(404).json({ message: 'Modal not found' });
    }

    if (!uploadedFile) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Ensure modalImages exists and the index is valid
    if (!modal.modalImages || !modal.modalImages[imageIndex]) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Delete the old image
    const oldImage = modal.modalImages[imageIndex];
    const oldImagePath = path.join(__dirname, '..', 'uploads', 'modalImages', oldImage);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath); // Delete the old image file
    }

    // Update the image at the specific index
    modal.modalImages[imageIndex] = uploadedFile.filename;

    // Save the updated modal
    const updatedModal = await modal.save();

    res.status(200).json(updatedModal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


router.delete('/uploads/modalImages/:filename', async (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '..', 'uploads', 'modalImages', filename); // Path to the image file

  console.log('Attempting to delete file:', filename);
  console.log('Image path:', imagePath);

  try {
    // Find and update the modal by removing the filename from the modalImages array
    const updatedModal = await Modal.findOneAndUpdate(
      { modalImages: filename }, // Assuming only filename is stored in DB, without full path
      { $pull: { modalImages: filename } }, // Ensure matching without path
      { new: true }
    );

    if (!updatedModal) {
      console.error('Image not found in database');
      return res.status(404).json({ message: 'Image not found in database' });
    }

    // Check if the file exists and delete it
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File not found on server:', imagePath);
        return res.status(404).json({ message: 'File not found on server' });
      }

      // Delete the file from the server
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting file from directory:', err);
          return res.status(500).json({ message: 'Error deleting file from server' });
        }

        console.log('File deleted from directory:', filename);
        res.status(200).json({ message: 'Image deleted successfully', modal: updatedModal });
      });
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});




module.exports = router;  // Export the router for use in the main app
