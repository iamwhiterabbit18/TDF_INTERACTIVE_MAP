// routes/aboutUsRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AboutUs = require('../models/AboutUs');


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

// Fetch About Us details
router.get('/', async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne();
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update About Us details
router.put('/', async (req, res) => {
    const { historicalBackground, vision, mission, goal, objectives } = req.body;

    // Check if any field is missing
    if (!historicalBackground || !vision || !mission || !goal || !objectives) {
        return res.status(400).json({ message: 'All fields (historicalBackground, vision, mission, goal, objectives) are required.' });
    }

    try {
        let aboutUs = await AboutUs.findOne();
        if (!aboutUs) {
            // If About Us record does not exist, create a new one
            aboutUs = new AboutUs({ historicalBackground, vision, mission, goal, objectives });
        } else {
            // Check if there's any change before updating
            const changes = {
                historicalBackground,
                vision,
                mission,
                goal,
                objectives
            };

            const hasChanges = Object.keys(changes).some(
                (key) => aboutUs[key] !== changes[key]
            );

            if (!hasChanges) {
                return res.status(400).json({ message: 'No changes detected in the data.' });
            }

            // If there are changes, update the About Us data
            aboutUs.historicalBackground = historicalBackground;
            aboutUs.vision = vision;
            aboutUs.mission = mission;
            aboutUs.goal = goal;
            aboutUs.objectives = objectives;
        }

        await aboutUs.save();
        res.json(aboutUs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update About Us image only
router.put('/image', upload.single('image'), async (req, res) => {
    try {
        let aboutUs = await AboutUs.findOne();

        if (!aboutUs) {
            return res.status(404).json({ message: 'About Us data not found' });
        }

        // If there's an existing image, delete it
        if (aboutUs.image) {
            const oldImagePath = path.join(__dirname, '../uploads/images/', aboutUs.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
            });
        }

        // Update with new image
        aboutUs.image = req.file ? req.file.filename : '';
        await aboutUs.save();
        res.json({ message: 'Image updated successfully', image: aboutUs.image });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete About Us image
router.delete('/image', async (req, res) => {
    try {
        const aboutUs = await AboutUs.findOne();
        if (!aboutUs || !aboutUs.image) {
            return res.status(404).json({ message: 'No image found to delete.' });
        }

        // Path to the image file
        const imagePath = path.join(__dirname, '../uploads/images', aboutUs.image);

        // Delete image file if it exists
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting image file:', err);
        });

        // Clear the image field in the database
        aboutUs.image = '';
        await aboutUs.save();

        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
