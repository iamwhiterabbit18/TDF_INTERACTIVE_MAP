const express = require('express');
const archiveRoutes = require('./archiveRoutes');
const deleteRoutes = require('./deleteRoutes');
const restoreRoutes = require('./restoreRoutes');

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Test route working');
  });
  

// Group routes for archiving, deleting, and restoring
router.use('/archive', archiveRoutes);  // /api/archive
router.use('/delete', deleteRoutes);    // /api/delete
router.use('/restore', restoreRoutes);  // /api/restore

module.exports = router;
