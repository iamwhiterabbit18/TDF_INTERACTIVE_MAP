// models/StaffLog.js
const mongoose = require('mongoose');

const staffLogSchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date },
    dateLoggedIn: { type: Date, default: Date.now },
});
module.exports = mongoose.model('StaffLog', staffLogSchema);