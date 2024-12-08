// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    images: {
        type: [String], // Array of image URLs
        required: true,
    },
    description: {type: String, },
    imageArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('NewsEvent', imageSchema);
