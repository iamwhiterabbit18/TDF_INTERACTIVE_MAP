// models/MarkerIcon.js
const mongoose = require('mongoose');

const MarkerIconSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconPath: { type: String,},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MarkerIcon', MarkerIconSchema);
