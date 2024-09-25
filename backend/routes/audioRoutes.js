const express = require('express');
const multer = require('multer');
const Audio = require('../models/Audio');
const fs = require('fs'); // To handle file deletion
const path = require('path'); // To extract file extension
const router = express.Router();

// Multer storage configuration for handling audio uploads
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Define the filename format (current timestamp + original file name)
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Define multer configuration with file filtering to only allow audio files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/flac', 'audio/mpeg'];

    // Only allow certain audio file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only audio files (mp3, wav, ogg, m4a, flac) are allowed!'));
    }
    cb(null, true);
  }
});

// Route to handle audio upload
router.post('/upload', upload.single('audio'), async (req, res) => {
  const { title } = req.body;
  const filePath = req.file.path; // Path of the uploaded file
  const format = path.extname(req.file.originalname).toUpperCase().replace('.', ''); // Extract file extension as format
  const originalName = req.file.originalname; // Get original file name

  try {
    let replaced = false;

    // Check if an audio with the same title already exists
    const existingAudio = await Audio.findOne({ title });
    if (existingAudio) {
      // Delete the existing audio file from the filesystem
      fs.unlinkSync(existingAudio.filePath);
      // Remove the existing audio entry from the database
      await Audio.deleteOne({ _id: existingAudio._id });
      replaced = true;
    }

    // Create a new Audio entry with the file's metadata
    const newAudio = new Audio({
      title,
      filePath,
      format,      // Save the file format
      originalName // Save the original file name
    });

    // Save the new audio entry to the database
    await newAudio.save();
    res.status(201).json({ newAudio, replaced });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(400).json({ error: 'Error uploading audio' });
  }
});


// Update audio details
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // Assuming only title is updated; adjust as needed

  try {
    const audio = await Audio.findByIdAndUpdate(id, { title }, { new: true });
    if (!audio) return res.status(404).send('Audio not found');
    res.send(audio);
  } catch (err) {
    res.status(500).send('Error updating audio');
  }
});

// Delete an audio file
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the audio file in the database
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).send('Audio not found');

    // Delete the file from the filesystem
    if (audio.filePath) {
      fs.unlinkSync(audio.filePath); // Delete the file from the 'uploads' directory
    }

    // Remove the audio entry from the database
    await Audio.findByIdAndDelete(id);
    res.send('Audio deleted successfully, including file from uploads.');
  } catch (err) {
    console.error('Error deleting audio:', err);
    res.status(500).send('Error deleting audio');
  }
});



// Route to assign audio to Onload/Onclick routes
router.post('/assign', async (req, res) => {
  const { audioId, route } = req.body;
  console.log('Assign request body:', { audioId, route });

  try {
    const audio = await Audio.findById(audioId); // Find the audio by ID
    if (!audio) return res.status(404).json({ error: 'Audio not found' });

    // Clear existing assignments (if any)
    audio.isAssignedToOnload = false;
    audio.isAssignedToOnclick = false;

    // Assign the audio to the selected route (onload/onclick/unassigned)
    if (route === 'onload') {
      audio.isAssignedToOnload = true;
    } else if (route === 'onclick') {
      audio.isAssignedToOnclick = true;
    } else if (route === 'unassigned') {
      // Leave audio unassigned
    } else {
      return res.status(400).json({ error: 'Invalid route assignment' });
    }

    // Save the updated audio assignment
    await audio.save();
    res.status(200).json({ message: 'Audio assigned successfully!' });
  } catch (error) {
    console.error('Error assigning audio:', error);
    res.status(500).json({ error: 'Error assigning audio' });
  }
});

// Fetch all audio files from the database
router.get('/', async (req, res) => {
  try {
    const audios = await Audio.find(); // Fetch all audio entries
    res.status(200).json(audios);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching audios' });
  }
});

// Route to fetch the audio file assigned to "Onload"
router.get('/onload', async (req, res) => {
  try {
    const onloadAudio = await Audio.findOne({ isAssignedToOnload: true }); // Fetch the audio assigned to Onload
    if (!onloadAudio) return res.status(404).json({ message: 'Onload audio not found' });

    res.sendFile(onloadAudio.filePath, { root: '.' }); // Send the file to the client
  } catch (error) {
    console.error('Error fetching Onload audio:', error);
    res.status(500).json({ error: 'Error fetching Onload audio' });
  }
});

// Route to fetch the audio file assigned to "Onclick"
router.get('/onclick', async (req, res) => {
  try {
    const onclickAudio = await Audio.findOne({ isAssignedToOnclick: true }); // Fetch the audio assigned to Onclick
    if (!onclickAudio) return res.status(404).json({ message: 'Onclick audio not found' });

    res.sendFile(onclickAudio.filePath, { root: '.' }); // Send the file to the client
  } catch (error) {
    console.error('Error fetching Onclick audio:', error);
    res.status(500).json({ error: 'Error fetching Onclick audio' });
  }
});

// Fetch an audio file by its ID
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id); // Find audio by ID
    if (!audio) return res.status(404).json({ error: 'Audio not found' });

    res.sendFile(audio.filePath, { root: './' }); // Send the file to the client
  } catch (error) {
    res.status(500).json({ error: 'Error fetching audio' });
  }
});

module.exports = router;
