const mongoose = require('mongoose');

const ModalSchema = new mongoose.Schema({
  audio_id: { type: String, required: true },
  title: { type: String, required: true },      // Title of the modal, required field
  description: { type: String,  },// Description text for the modal, required field
  technologies: { type: String},// Technologies text for the modal, required field
  modalImages: { type: [String], default: [] }   ,        // Array of optional image URLs, default is an empty array
  imageArchived: { type: Boolean, default: false },
});

// Creating and exporting the Modal model. This model represents a collection of modals in MongoDB.
const Modal = mongoose.model('Modal', ModalSchema);

module.exports = Modal;