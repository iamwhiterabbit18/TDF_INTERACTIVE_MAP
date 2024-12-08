// models/Audio.js

const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  title: { type: String},
  originalName: { type: String },
  filePath: { type: String, required: false, default: null},
  format: { type: String, required: false, default: null },
  audioArchived: { type: Boolean, default: false }, // Archive flag for audio
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
