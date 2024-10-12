// In your backend route file (e.g., guestRoutes.js)
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import the UUID package
const router = express.Router();
const GuestLog = require('../models/GuestLog'); // Adjust the path as necessary
const moment = require('moment-timezone');

router.post('/logGuest', async (req, res) => {
    const now = moment.tz("Asia/Shanghai");
    const dateTimeIN = now.format("YYYY-MM-DD : h:mm A");

    try {
        const guestLog = new GuestLog({
            guestId: uuidv4(), // Generate a unique ID
            dateTimeIN
        });

        await guestLog.save();
        res.status(201).json(guestLog); // Return the created guest log
    } catch (error) {
        console.error('Error logging guest login:', error);
        res.status(500).json({ message: 'Failed to log guest login' });
    }
});

module.exports = router;
