const mongoose = require('mongoose');

const guestLogSchema = new mongoose.Schema({
    guestId: { type: String, required: true },
    dateTimeIN: { type: String, required: true }, // Store in the format "YYYY-MM-DD, HH:MM A"
    sexAtBirth: { type: String, required: true},
    role: { type: String, required: true}, // New field to store the role
    customRole: { type: String,},
    feedback: {
        rating: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
        comment: { type: String }, // Optional feedback comment
        feedbackDate: { type: Date, default: Date.now }  // Automatically stores the current date and time when feedback is submitted
    }
});

module.exports = mongoose.model('GuestLog', guestLogSchema);
