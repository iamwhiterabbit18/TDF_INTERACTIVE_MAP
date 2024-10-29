const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const NewsEvent = require('../models/NewsEvent');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});


// Get all images (GET)
router.get('/', async (req, res) => { // Removed /api/images from the path
    try {
        const images = await NewsEvent.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Error fetching images", error });
    }
});

// Get specific image document by ID (GET)
router.get('/:id', async (req, res) => { // Removed /api/images from the path
    try {
        const { id } = req.params;
        const imageDoc = await NewsEvent.findById(id);

        if (!imageDoc) {
            return res.status(404).json({ message: "Images not found" });
        }

        res.status(200).json(imageDoc);
    } catch (error) {
        res.status(500).json({ message: "Error fetching image", error });
    }
});



// Add new images (POST)
router.post('/', upload.array('images', 10), async (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    console.log("Uploaded files:", req.files); // Log the uploaded files

    try {
        // Map over uploaded files and replace backslashes with forward slashes
        const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/')); 
        let imageDoc = await NewsEvent.findOne(); // Find the first image document

        if (imageDoc) {
            // If a document exists, update the images array
            imageDoc.images.push(...imagePaths); // Add new images to the existing array
            await imageDoc.save();
            return res.status(200).json(imageDoc);
        } else {
            // If no document exists, create a new one
            const newImages = new NewsEvent({ images: imagePaths });
            await newImages.save();
            return res.status(201).json(newImages);
        }
    } catch (error) {
        console.error("Error adding images:", error); // Log any error
        res.status(500).json({ message: "Error adding images", error });
    }
});



// PUT route to update a specific image by filename
router.put('/uploads/images/:filename', upload.single('image'), async (req, res) => {
    try {
        const { filename } = req.params;

        // Find the document containing the images array
        const imageDoc = await NewsEvent.findOne({ images: `uploads/images/${filename}` });

        if (!imageDoc) {
            return res.status(404).json({ message: "Image document not found" });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Get the old image path before updating
        const oldImagePath = `uploads/images/${filename}`;

        // Handle the new image upload from multer
        const updatedImagePath = req.file.path.replace(/\\/g, '/'); // New image path with forward slashes

        // Update the specific image path in the array
        const updatedImages = imageDoc.images.map(image => image === oldImagePath ? updatedImagePath : image);
        imageDoc.images = updatedImages;

        // Save the updated document
        await imageDoc.save();

        // Delete the old image from the server
        const oldImageAbsolutePath = path.join(__dirname, '..', oldImagePath); // Get full path for deletion
        fs.unlink(oldImageAbsolutePath, (err) => {
            if (err) {
                console.error('Error deleting old image:', err);
            } else {
                console.log('Old image deleted:', oldImagePath);
            }
        });

        res.status(200).json(imageDoc); // Return the updated document
    } catch (error) {
        console.error("Error updating image:", error);
        res.status(500).json({ message: "Error updating image", error });
    }
});




// DELETE route to delete a specific image by its filename
router.delete('/uploads/images/:filename', async (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', 'images', filename); // Path to the image file

    console.log('Attempting to delete file:', filename);
    console.log('Image path:', imagePath);

    try {
      // Remove the image from the MongoDB images array using the filename
      const updatedDoc = await NewsEvent.findOneAndUpdate(
        { images: `uploads/images/${filename}` }, // Use forward slashes
        { $pull: { images: `uploads/images/${filename}` } }, // Use forward slashes
        { new: true }
    );

        if (!updatedDoc) {
            console.error('Image not found in database');
            return res.status(404).json({ message: 'Image not found in database' });
        }

        // Delete the file from the server if it exists
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found on server:', imagePath);
                return res.status(404).json({ message: 'File not found on server' });
            }

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting file from directory:', err);
                    return res.status(500).json({ message: 'Error deleting file from server' });
                }
                console.log('File deleted from directory:', filename);
                res.status(200).json({ message: 'Image deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image' });
    }
});



module.exports = router;
