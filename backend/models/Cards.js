// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  modal_id: {type: String, required : true},
  areaName: { type: String, required: true },
  areaLocation:{type: String },
  image: { type: String },
  quickFacts: { type: String, },
  iconType: { type: String, required: true },
  imageArchived: { type: Boolean, default: false }, // Archive flag for image
});

module.exports = mongoose.model('Card', cardSchema);
