// models/AboutUs.js
const mongoose = require('mongoose');

const AboutUsSchema = new mongoose.Schema({
    historicalBackground: { type: String, required: true },
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    goal: { type: String, required: true },
    objectives: { type: String, required: true },
    image: { type: String }, // Store image URL or path if needed
    imageArchived: { type: Boolean, default: false }, // Archive flag for image
});

module.exports = mongoose.model('AboutUs', AboutUsSchema);
