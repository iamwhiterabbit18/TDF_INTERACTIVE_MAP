// models/Audio.js

// Importing the mongoose package to define the schema and create the model.
const mongoose = require('mongoose');

// Defining the schema for the Audio collection in MongoDB.
const audioSchema = new mongoose.Schema({
  // Title of the audio file, required for each entry.
  title: { type: String, required: true },
  
  // The original file name of the uploaded audio (not required but useful for display).
  originalName: { type: String },
  
  // Path where the audio file is stored on the server, required field.
  filePath: { type: String, required: true },
  
  // The format of the audio file (e.g., MP3, WAV), required field.
  format: { type: String, required: true },
  
  // Boolean field to mark if this audio is assigned to be played on the "Onload" page.
  isAssignedToOnload: { type: Boolean, default: false },
  
  // Boolean field to mark if this audio is assigned to be played on the "Onclick" button.
  isAssignedToOnclick: { type: Boolean, default: false }
});

// Creating the Audio model based on the audioSchema.
const Audio = mongoose.model('Audio', audioSchema);

// Exporting the Audio model to be used in other parts of the application.
module.exports = Audio;
