const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminName: { type: String, required: true },
    dateTimeIN: { type: String, required: true }, // Store in the format "YYYY-MM-DD, HH:MM A"
    dateTimeOUT: { type: String }, // Optional, for logout date and time
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
