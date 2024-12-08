const express = require('express');
const { restoreField , restoreDocument } = require('../utility/archiveUtils');

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Test route working');
  });
  

// Route to restore a field using archiveId 
// For Cards , Modal , Audio , NewsEvent , AboutUs (for field restoration)
router.put('/:archiveId', async (req, res) => {
    const { archiveId } = req.params;  // Get the archiveId from the request params
  
    console.log('Received archiveId:', archiveId);  // Log the archiveId to the console
  
    try {
      await restoreField(archiveId);
      res.json({ message: 'Field restored successfully' });
    } catch (error) {
      console.error('Error during restore:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Restore a user account using archiveId
router.put('/user/:archiveId', async (req, res) => {
  const { archiveId } = req.params;  // Get the archive ID from the request params

  try {
      console.log('Restoring user account with archiveId:', archiveId);

      // Restore the user account
      await restoreDocument(archiveId);

      res.json({ message: 'User account restored successfully' });
  } catch (error) {
      console.error('Error during user account restoration:', error);
      res.status(500).json({ error: error.message });
  }
});

  
  module.exports = router;