// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    images: {
        type: [String], // Array of image URLs
        required: true,
    }
});

module.exports = mongoose.model('NewsEvent', imageSchema);
