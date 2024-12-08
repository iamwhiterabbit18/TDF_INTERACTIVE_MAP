const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: true,
    trim: true,
  },
  worldPosition: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  iconType: {
    type: String,  // You can change this to 'String' to store the icon name or type
    required: true,  // Ensure iconType is required when creating a marker
  },
}, { timestamps: true });

const Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
