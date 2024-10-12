// models/GuestLog.js
const mongoose = require('mongoose');

const guestLogSchema = new mongoose.Schema({
    guestId: { type: String, required: true },
    dateTimeIN: { type: String, required: true }, // Store in the format "YYYY-MM-DD, HH:MM A"
    dateTimeOUT: { type: String }, // Optional, for logout date and time
});

module.exports = mongoose.model('GuestLog', guestLogSchema);