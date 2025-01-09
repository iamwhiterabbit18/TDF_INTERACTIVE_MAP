const express = require('express');
const { restoreField , restoreDocument,restoreMarkerIcon } = require('../utility/archiveUtils');

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

// Route for restoring a MarkerIcon
router.put('/markerIcon/:id', async (req, res) => {
  const archivedDataId = req.params.id;
  console.log('Restoring MarkerIcon with archive ID:', archivedDataId);

  try {
    // Call the restoreMarkerIcon function
    const restoredMarkerIcon = await restoreMarkerIcon(archivedDataId);
    console.log('Restored MarkerIcon:', restoredMarkerIcon);

    // Respond with success message and restored data
    res.status(200).json({
      message: 'MarkerIcon restored successfully',
      data: restoredMarkerIcon,
    });
  } catch (error) {
    console.error('Error restoring MarkerIcon:', error); // Log the error for better visibility
    res.status(500).json({ message: 'Error restoring MarkerIcon', error: error.message });
  }
});


  module.exports = router;