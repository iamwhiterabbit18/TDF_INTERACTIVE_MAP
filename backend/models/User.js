const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'guest'], // Add 'guest' role
        default: 'guest', // Set default role to 'guest'
    },
}, { timestamps: true }); // This adds createdAt and updatedAt fields automatically

const User = mongoose.model('User', userSchema);

module.exports = User;
