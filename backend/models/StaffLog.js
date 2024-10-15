// models/StaffLog.js
const mongoose = require('mongoose');

const staffLogSchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    dateTimeIN: { type: String, required: true }, // Store in the format "YYYY-MM-DD, HH:MM A"
    dateTimeOUT: { type: String }, // Optional, for logout date and time
});
module.exports = mongoose.model('StaffLog', staffLogSchema);