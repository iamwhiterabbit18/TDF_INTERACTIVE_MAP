const fs = require('fs');
const path = require('path');
const Archive = require('../models/Archive');
const express = require('express');

const router = express.Router();

const folderMapping = {
  Cards: 'cardsImg',
  Modal: 'modalImages',
  Audio: 'audio',
  NewsEvent: 'images',
  User: null,   
  // Add other mappings as needed
};

router.delete('/archive/:archiveId', async (req, res) => {
    const { archiveId } = req.params;
  
    try {
        const archive = await Archive.findById(archiveId);
  
        if (!archive) {
            return res.status(404).json({ error: 'Archive entry not found' });
        }
  
        // Log the originalCollection to debug the issue
        console.log('originalCollection:', archive.originalCollection);
  
        // Determine the correct folder for the archived file
        const folder = folderMapping[archive.originalCollection];
        if (!folder) {
            // Special handling for collections without files (like User)
            console.log('No folder mapping for this collection. Skipping file deletion.');
            // Proceed to delete the archive entry without attempting to delete a file
            await archive.deleteOne();
            return res.json({ message: 'Archive entry deleted permanently, no associated file' });
        }
  
        // If there is a file, proceed with deleting it
        const fileName = archive.data[archive.fieldName];
        if (fileName) {
            const archivePath = path.join(__dirname, '../archives', folder, fileName);
            console.log('Attempting to delete file at:', archivePath);
  
            // Check if the file exists before deleting
            if (fs.existsSync(archivePath)) {
                fs.unlink(archivePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log(`File deleted: ${fileName}`);
                    }
                });
            } else {
                console.warn('File does not exist:', archivePath);
            }
        } else {
            console.log('No file associated with this archive entry, skipping file deletion');
        }
  
        // Remove the archive entry from the database
        await archive.deleteOne();
        res.json({ message: 'Archive entry and file deleted permanently' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
