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
  const audioFile = req.file;  // Check if a new file is uploaded
  const filePath = audioFile ? audioFile.path : null;  // Get the new file path, if provided

  try {
    // Find the existing audio record by ID
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).send('Audio not found');

    // Update the title if a new title is provided
    if (title) {
      audio.title = title;
    }

    // If a new audio file is uploaded, replace the old file
    if (filePath) {
      // Delete the old file from the directory if `filePath` exists and is valid
      if (audio.filePath) {
        const oldFilePath = path.join(__dirname, '..', audio.filePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Remove the old file
          console.log(`Deleted old file at: ${oldFilePath}`);
        }
      }

      // Update the file path and original file name in the audio document
      audio.filePath = filePath;
      audio.originalName = audioFile.originalname; // Update originalName with the new file's name
      audio.format = path.extname(audioFile.originalname).toUpperCase().replace('.', ''); // Set the new format
    }

    // Save the updated audio record
    await audio.save();

    res.send(audio); // Send back the updated audio record
  } catch (err) {
    console.error('Error updating audio:', err);
    res.status(500).send('Error updating audio');
  }
});





 // Comment out muna might need the delete / assign routes !!will delete after approval!!
 
{/*} // Route to handle audio upload
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


// Route to handle new audio upload (POST) (ver2)
router.post('/uploads/:id', upload.single('audio'), async (req, res) => {
  const { title } = req.body;

  // Error if an ID is inadvertently provided for a new document
  if (req.body.audioId) return res.status(400).json({ error: 'ID should not be provided for new uploads' });

  // Logic similar to update, without `findById`
  const newAudio = new Audio({
    title,
    filePath: req.file.path,
    originalName: req.file.originalname,
    format: path.extname(req.file.originalname).toUpperCase().replace('.', ''),
  });

  try {
    await newAudio.save();
    res.status(201).json(newAudio);
  } catch (error) {
    console.error('Error saving new audio:', error);
    res.status(500).json({ error: 'Error saving new audio' });
  }
});

*/}

// DELETE route for removing audio file while retaining document
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the audio document
    const audio = await Audio.findById(id);
    if (!audio) return res.status(404).send('Audio not found');

    // Normalize file path for compatibility and attempt deletion
    const normalizedPath = path.normalize(audio.filePath);
    console.log('Attempting to delete file at:', normalizedPath);  // Log for confirmation

    // Delete the file only if it exists
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
      console.log('File deleted successfully.');
    } else {
      console.warn('File path does not exist:', normalizedPath);
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






{/*

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
}); */}



module.exports = router;
