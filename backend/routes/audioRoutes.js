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
    cb(null, 'uploads/audios');
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
    console.log(file.mimetype); 
    const allowedTypes = [
      'audio/mp3', 'audio/wav','audio/m4a', 'audio/x-m4a', 'audio/mpeg', 'audio/mp4'
    ];
    // Only allow certain audio file types
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only audio files (mp3, wav, m4a) are allowed!'));
    }
    cb(null, true);
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




//Routes for adding/updating audio file/title
router.put('/update/:id', upload.single('audio'), async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const audioFile = req.file; // Check if a new file is uploaded

  try {
    // Find the existing audio record by ID
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).send('Audio not found');

    // Update the title if a new title is provided
    if (title) {
      audio.title = title;
    }

    // If a new audio file is uploaded, replace the old file
    if (audioFile) {
      // Delete the old file from the directory if it exists
      if (audio.filePath) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', audio.filePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Remove the old file
          console.log(`Deleted old file at: ${oldFilePath}`);
        }
      }

      // Extract only the filename from the uploaded file's path
      const newFileName = path.basename(audioFile.path); // e.g., "1733057710335-Bee.wav"

      // Update the audio document with the new filename
      audio.filePath = newFileName; // Store only the filename in the database
      audio.originalName = audioFile.originalname; // Store the original name for reference
      audio.format = path.extname(audioFile.originalname).toUpperCase().replace('.', ''); // Set the new format (e.g., "WAV")
    }

    // Save the updated audio record
    await audio.save();

    res.send(audio); // Send back the updated audio record
  } catch (err) {
    console.error('Error updating audio:', err);
    res.status(500).send('Error updating audio');
  }
});



// DELETE route for removing audio file while retaining document
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the audio document
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).send('Audio not found');

    // Construct the full file path
    const filePath = path.join(__dirname, '..', 'uploads', 'audios', audio.filePath);
    console.log('Attempting to delete file at:', filePath);  // Log for confirmation

    // Delete the file only if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted successfully.');
    } else {
      console.warn('File path does not exist:', filePath);
    }

    // Update filePath to null and save the document
    audio.filePath = null;
    audio.originalName = "";
    audio.format = null;
    await audio.save();

    res.send('Audio file deleted successfully; document retained.');
  } catch (err) {
    console.error('Error in delete route:', err.message || err);
    res.status(500).send('Error occurred during deletion.');
  }
});







module.exports = router;
