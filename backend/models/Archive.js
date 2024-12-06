const mongoose = require('mongoose');

const ArchiveSchema = new mongoose.Schema({
  originalCollection: { type: String, required: true },
  originalId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fieldName: { type: String, required: true }, // e.g., "image" or "audio"
  data: { type: mongoose.Schema.Types.Mixed }, // Field data
  archivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Archive', ArchiveSchema);
