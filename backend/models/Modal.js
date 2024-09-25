// Importing mongoose to define the Modal schema and model
const mongoose = require('mongoose');

// Defining the schema for the Modal model. This schema defines the structure of a modal document in MongoDB.
// Each modal has a title (string, required), description (string, required), and up to 5 optional image URLs.
const ModalSchema = new mongoose.Schema({
  title: { type: String, required: true },      // Title of the modal, required field
  description: { type: String, required: true },// Description text for the modal, required field
  image1: { type: String, default: null },      // First optional image URL, default is null
  image2: { type: String, default: null },      // Second optional image URL, default is null
  image3: { type: String, default: null },      // Third optional image URL, default is null
  image4: { type: String, default: null },      // Fourth optional image URL, default is null
  image5: { type: String, default: null }       // Fifth optional image URL, default is null
});

// Creating and exporting the Modal model. This model represents a collection of modals in MongoDB.
const Modal = mongoose.model('Modal', ModalSchema);

module.exports = Modal;