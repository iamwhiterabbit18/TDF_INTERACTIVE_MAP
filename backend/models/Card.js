// models/Card.js

// Importing mongoose to define the Card schema and model
const mongoose = require('mongoose');

// Defining the schema for the Card model. This schema defines the structure of a card document in MongoDB.
// Each card has an areaName (string), weather (string), quickfacts (string), image URL (string),
// and a weatherIcon (string) which refers to an icon representing the weather.
const cardSchema = new mongoose.Schema({
  // pos
  // icon
  areaName: String,   // Name of the area for the card
  weather: String,    // Weather condition of the area
  quickfacts: String, // Short description or facts about the area
  image: String,      // URL or path to the image of the area
  weatherIcon: String // URL or path to the weather icon
  // s-desc
});

// Exporting the Card model, so it can be used elsewhere in the application.
// The 'Card' model represents a collection of cards in MongoDB.
module.exports = mongoose.model('Card', cardSchema);