// models/GuestLog.js
const mongoose = require('mongoose');

const guestLogSchema = new mongoose.Schema({
    guestId: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date },
    dateLoggedIn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GuestLog', guestLogSchema);