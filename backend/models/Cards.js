// models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  card_id: {type: String, required : true},
  areaName: { type: String, required: true },
  areaLocation:{type: String},
  image: { type: String },
  quickFacts: { type: String, required: true },
});

module.exports = mongoose.model('Card', cardSchema);
