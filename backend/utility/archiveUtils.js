const fs = require('fs'); // Use fs.promises for async handling
const path = require('path');
const Archive = require('../models/Archive');

const folderMapping = {
  Cards: 'cardsImg', // Folder for card images
  Modal: 'modalImages', // Folder for modal images
  Audio: 'audios', // Folder for audio files (assuming directly in 'uploads')
  NewsEvent: 'images', // Folder for news/about us images
  AboutUs: 'images',
};

const archiveField = async (originalCollection, documentId, fieldName, fieldData) => {
  try {
    // Use folder mapping to construct paths
    const folder = folderMapping[originalCollection];

    // Extract only the file name from fieldData if it contains a path
    const fileName = path.basename(fieldData);

    // Construct the corrected source and archive paths
    const sourcePath = path.join(__dirname, `../uploads/${folder}/`, fileName);
    const archivePath = path.join(__dirname, `../archives/${folder}/`, fileName);

    // Ensure the archive directory exists
    const archiveDir = path.dirname(archivePath);
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Move the file
    fs.renameSync(sourcePath, archivePath);
    console.log(`File archived: ${fileName}`);

    // Backup the field in the Archive collection
    await Archive.create({
      originalCollection,
      originalId: documentId,
      fieldName,
      data: { [fieldName]: fieldData },
    });
    console.log(`Record backed up to Archive collection for ${fieldName}`);
  } catch (err) {
    console.error('Error during archiving process:', err);
    throw new Error(`Archiving failed for ${fieldName}: ${err.message}`);
  }
};



const restoreField = async (archiveId) => {
  const archive = await Archive.findById(archiveId);

  if (!archive) {
    throw new Error('Archive entry not found');
  }

  const { originalCollection, originalId, fieldName, data } = archive;
  const OriginalModel = require(`../models/${originalCollection}`);
  
  // Step 1: Remove the archived flag from the original document
  await OriginalModel.findByIdAndUpdate(originalId, {
    $set: { [`${fieldName}Archived`]: false }
  });

  // Step 2: Extract file name and paths correctly
  const filePath = data[fieldName];  
  const fileName = path.basename(filePath); // Extract the file name
  const folder = folderMapping[originalCollection];  

  const archivePath = path.join(__dirname, '../archives', folder, fileName);
  const originalPath = path.join(__dirname, '../uploads', folder, fileName);

  // Step 3: Use fs.rename to move the file back to its original folder
  fs.rename(archivePath, originalPath, (err) => {
    if (err) {
      console.error('Error restoring file:', err);
      throw new Error('Failed to restore the file');
    } else {
      console.log(`File restored: ${fileName}`);
    }
  });

  // Step 4: Update the original document's field with the restored file path
  const updatedData = {
    [fieldName]: fileName, // Set the file path back to the original document
  };
  
    // Check if it's a card, modal, or audio and handle accordingly
    if (originalCollection === 'Cards') {
      // For cards, it's a single image, so replace the current image field
      await OriginalModel.findByIdAndUpdate(originalId, {
        $set: { 
          ...updatedData,  // Update the image field with the restored data
          imageArchived: false // Set imageArchived to false when restoring
        }
      });
    } 
    else if (originalCollection === 'Modal') {
      // For modals, append the restored image to the modalImages array
      console.log("Adding restored image to modalImages array");

      // Update the modal's modalImages array using $push
      await OriginalModel.findByIdAndUpdate(originalId, {
        $push: { [fieldName]: updatedData[fieldName] },  // Use $push to add the new image to the array
        $set: { imageArchived: false }
      });
    }
     else if (originalCollection === 'Audio') {
      // Restore for Audio
      const originalName = fileName.split('-').slice(1).join('-'); // Remove multer prefix
      const format = path.extname(fileName).toUpperCase().replace('.', ''); // Extract format
    
      const audioData = {
        ...updatedData,
        originalName, // Restore the original name
        format,       // Restore the format
        audioArchived: false, // Clear the archive flag
      };
    
      await OriginalModel.findByIdAndUpdate(originalId, { $set: audioData });
    }
     else if (originalCollection === 'NewsEvent') {
      console.log("Restoring image to NewsEvent");
  
      // Find the NewsEvent document
      const newsEvent = await OriginalModel.findById(originalId);
      if (!newsEvent) {
        throw new Error('NewsEvent document not found');
      }
  
      // Push the restored image to the images array
      newsEvent.images.push(updatedData[fieldName]);
  
       // Set imageArchived to false when restoring the image
      newsEvent.imageArchived = false;
  
      // Save the updated NewsEvent document
      await newsEvent.save();
    } 
    else if(originalCollection === 'AboutUs') {
      // For AboutUs, we just set the image back to the restored file name
      await OriginalModel.findByIdAndUpdate(originalId, {
        $set: { 
          ...updatedData,  // Update the image field with the restored data
          imageArchived: false // Set imageArchived to false when restoring
        }
      });
    }
  // Step 5: Remove the archive entry
  await archive.deleteOne();
};


const archiveDocument = async (originalCollection, documentId, documentData) => {
  try {
    // Create a new archive entry for the document
    await Archive.create({
      originalCollection,
      originalId: documentId,
      fieldName: 'document', // Indicate this is the entire document
      data: documentData, // Store the entire document data
    });

    console.log(`Document archived: ${originalCollection} (ID: ${documentId})`);

    // Delete the document from its original collection
    const OriginalModel = require(`../models/${originalCollection}`);
    await OriginalModel.findByIdAndDelete(documentId);
  } catch (err) {
    console.error('Error during document archiving:', err);
    throw new Error(`Archiving failed for document: ${err.message}`);
  }
};

const restoreDocument = async (archiveId) => {
  try {
    // Find the archive entry by ID
    const archive = await Archive.findById(archiveId);
    if (!archive || archive.fieldName !== 'document') {
      throw new Error('Invalid archive entry for document');
    }

    const { originalCollection, originalId, data } = archive;

    // Restore the document to its original collection
    const OriginalModel = require(`../models/${originalCollection}`);
    const restoredDocument = new OriginalModel(data);
    await restoredDocument.save();

    console.log(`Document restored: ${originalCollection} (ID: ${originalId})`);

    // Delete the archive entry
    await archive.deleteOne();
  } catch (err) {
    console.error('Error during document restoration:', err);
    throw new Error(`Restoration failed for document: ${err.message}`);
  }
};


module.exports = { archiveField, restoreField , archiveDocument , restoreDocument };
