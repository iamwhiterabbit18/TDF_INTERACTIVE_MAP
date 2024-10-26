// In your backend route file (e.g., guestRoutes.js)
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import the UUID package
const router = express.Router();
const GuestLog = require('../models/GuestLog'); // Adjust the path as necessary
const moment = require('moment-timezone');

// Route to log guest with UUID
router.post('/logGuest', async (req, res) => {
    const now = moment.tz("Asia/Shanghai");
    const dateTimeIN = now.format("YYYY-MM-DD : h:mm A");

    try {
        const guestId = uuidv4(); // Generate UUID for guest
        // Check if the guest log already exists
        const guestLog = await GuestLog.findOne({ guestId });
        // If guest log doesn't exist, create a new one
        if (!guestLog) {
            const newGuestLog = new GuestLog({
                guestId,
                dateTimeIN
            });
            await newGuestLog.save();
            // Send guestId back to the frontend
            return res.status(201).json({guestId ,newGuestLog}); // Return newly created log
        }
        // If guest log already exists, just return the existing log
        res.status(200).json(guestLog);
    } catch (error) {
        console.error('Error logging guest login:', error);
        res.status(500).json({ message: 'Failed to log guest login' });
    }
});

// Route to update feedback for an existing guest log
router.post('/updateFeedback', async (req, res) => {
    const { guestId, rating, comment } = req.body;
    console.log('Received guestId:', guestId); // Log the guestId for debugging

    try {
        // Find guest log by guestId and update feedback
        const updatedGuestLog = await GuestLog.findOneAndUpdate(
            { guestId },
            { $set: { 'feedback.rating': rating, 'feedback.comment': comment } },
            { new: true }
        );
        

        if (!updatedGuestLog) {
            return res.status(404).json({ message: 'Guest log not found' });
        }

        res.status(200).json(updatedGuestLog);
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ message: 'Failed to update feedback' });
    }
});


module.exports = router;
