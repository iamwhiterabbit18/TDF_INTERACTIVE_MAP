// models/AdminLog.js
const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date },
    dateLoggedIn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminLog', adminLogSchema);