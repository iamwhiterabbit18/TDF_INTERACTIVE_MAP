const fs = require('fs');
const path = require('path');
const Archive = require('../models/Archive');


const restoreField = async (archiveId) => {

    // Step 1: Find the archive entry
    const archive = await Archive.findById(archiveId);
  
    if (!archive) {
      throw new Error('Archive entry not found');
    }
  
    const { originalCollection, originalId, fieldName, data } = archive;
  
    // Step 2: Remove the archived flag from the original document
    const OriginalModel = require(`../models/${originalCollection}`);
    await OriginalModel.findByIdAndUpdate(originalId, {
      $set: { [`${fieldName}Archived`]: false }
    });
  
    // Step 3: Move the file back to its original folder
    const fileName = data[fieldName];
    const archivePath = path.join(__dirname, '../uploads/archive/', fileName);
    const originalPath = path.join(__dirname, '../uploads/', fileName);
  
    fs.rename(archivePath, originalPath, (err) => {
      if (err) {
        console.error('Error restoring file:', err);
      } else {
        console.log(`File restored: ${fileName}`);
      }
    });
  
    // Step 4: Remove the archive entry
    await archive.remove();
  };
  