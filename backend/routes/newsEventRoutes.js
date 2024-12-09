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
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    try {
        // Extract filenames from uploaded files
        const filenames = req.files.map(file => file.filename);

        // Find the first image document
        let imageDoc = await NewsEvent.findOne();

        if (imageDoc) {
            // Update existing document
            imageDoc.images.push(...filenames); // Add new filenames
            const numNewImages = filenames.length;

            // Add null placeholders for each new image
            imageDoc.newsHeader.push(...Array(numNewImages).fill(null));
            imageDoc.description.push(...Array(numNewImages).fill(null));

            await imageDoc.save();
            return res.status(200).json(imageDoc);
        } else {
            // Create a new document
            const numNewImages = filenames.length;

            const newImages = new NewsEvent({
                images: filenames,
                newsHeader: Array(numNewImages).fill(null),
                description: Array(numNewImages).fill(null),
            });

            await newImages.save();
            return res.status(201).json(newImages);
        }
    } catch (error) {
        console.error("Error adding images:", error);
        res.status(500).json({ message: "Error adding images", error });
    }
});




// PUT route to update a specific image by filename
router.put('/uploads/images/:filename', upload.single('image'), async (req, res) => {
    try {
        const { filename } = req.params;

        // Find the document containing the images array
        const imageDoc = await NewsEvent.findOne({ images: `${filename}` });

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



// Backend route for updating header and description
router.put('/updateNews', async (req, res) => {
    try {
        const updatedData = req.body; // Array of objects containing the filename, header, and description
        const document = await NewsEvent.findOne({}); // Assuming you have one document to update

        // If document doesn't exist, return an error
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Check if any changes are being sent
        let hasChanges = false;

        updatedData.forEach(({ filename, newsHeader, description }) => {
            const imageIndex = document.images.findIndex(img => img === filename);
            if (imageIndex !== -1) {
                // Compare existing and updated values
                if (
                    document.newsHeader[imageIndex] !== newsHeader ||
                    document.description[imageIndex] !== description
                ) {
                    hasChanges = true;
                }
            }
        });

        if (!hasChanges) {
            // If no changes, return early
            return res.status(400).json({ message: "No changes detected. Nothing was saved." });
        }

        // Apply the updates if changes exist
        updatedData.forEach(({ filename, newsHeader, description }) => {
            const imageIndex = document.images.findIndex(img => img === filename);
            if (imageIndex !== -1) {
                document.newsHeader[imageIndex] = newsHeader;
                document.description[imageIndex] = description;
            }
        });

        // Save the updated document
        await document.save();

        res.status(200).json({ message: "Successfully updated news." });
    } catch (error) {
        console.error("Error updating images:", error);
        res.status(500).json({ message: "Error updating images", error });
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
