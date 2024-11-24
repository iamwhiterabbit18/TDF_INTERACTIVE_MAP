// models/ContactUs.js
const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    facebookPage: {
        type: String,
        required: true
    }
},); //{ timestamps: true }

module.exports = mongoose.model('ContactUs', contactUsSchema);
