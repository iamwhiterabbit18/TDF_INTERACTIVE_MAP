// models/GuestLog.js
const mongoose = require('mongoose');

const guestLogSchema = new mongoose.Schema({
    guestId: { type: String, required: true },
    dateTimeIN: { type: String, required: true }, // Store in the format "YYYY-MM-DD, HH:MM A"
    //dateTimeOUT: { type: String }, // Optional, for logout date and time
    feedback: {
        rating: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
        comment: { type: String } // Optional feedback comment
    }
});

module.exports = mongoose.model('GuestLog', guestLogSchema);