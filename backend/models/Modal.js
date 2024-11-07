// Importing mongoose to define the Modal schema and model
const mongoose = require('mongoose');

// Defining the schema for the Modal model. This schema defines the structure of a modal document in MongoDB.
// Each modal has a title (string, required), description (string, required), and up to 5 optional image URLs.
const ModalSchema = new mongoose.Schema({
  modal_id: { type: String, required: true },
  title: { type: String, required: true },      // Title of the modal, required field
  description: { type: String, required: true },// Description text for the modal, required field
  technologies: { type: String},// Technologies text for the modal, required field
  modalImages: { type: [String], default: [] }           // Array of optional image URLs, default is an empty array
});

// Creating and exporting the Modal model. This model represents a collection of modals in MongoDB.
const Modal = mongoose.model('Modal', ModalSchema);

module.exports = Modal;