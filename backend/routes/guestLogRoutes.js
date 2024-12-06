// In your backend route file (e.g., guestRoutes.js)
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import the UUID package
const router = express.Router();
const GuestLog = require('../models/GuestLog'); // Adjust the path as necessary
const moment = require('moment-timezone');

// Route to log guest with UUID, sexAtBirth, and role
router.post('/logGuest', async (req, res) => {
    const { sexAtBirth, role, customRole } = req.body;
    console.log('Guest ID:','Sex:', sexAtBirth, 'Role:',role, 'CustomeRole' ,customRole)

    if (!sexAtBirth || !role) {
        return res.status(400).json({ message: 'Sex at birth and role are required' });
    }

    try {
        const guestId = uuidv4();
        const now = moment.tz('Asia/Shanghai').format('YYYY-MM-DD : h:mm A');

        const newGuestLog = new GuestLog({
            guestId,
            dateTimeIN: now,
            sexAtBirth,
            role,
            customRole: role === 'Others' ? customRole : undefined, // Only store customRole if role is "Others"
        });

        await newGuestLog.save();
        res.status(201).json({ guestId, newGuestLog });
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


// Route to get analytics data
router.get('/analytics', async (req, res) => {
    try {
        // Get all guest logs
        const logs = await GuestLog.find();

        // Process data
        const ratings = [1, 2, 3, 4, 5].map((rating) => ({
            label: `${rating} Stars`,
            value: logs.filter((log) => log.feedback?.rating === rating).length,
        }));

        // Process Sexes (normalize case)
        const sexes = ['Male', 'Female', 'Other'].map((sex) => ({
            label: sex,
            value: logs.filter(
                (log) => log.sexAtBirth?.toLowerCase() === sex.toLowerCase()
            ).length,
        }));


        const roles = Array.from(new Set(logs.map((log) => log.role))).map((role) => ({
            label: role,
            value: logs.filter((log) => log.role === role).length,
        }));

        // Send analytics data
        res.status(200).json({ ratings, sexes, roles });
    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics data' });
    }
});


router.get('/guestLogs', async (req, res) => {
    try {
        // Fetch guest logs where rating is defined (not null or undefined)
        const guestLogs = await GuestLog.find({ 'feedback.rating': { $ne: null } });

        // Respond with the filtered guest logs
        res.status(200).json(guestLogs);
    } catch (error) {
        console.error('Error fetching guest logs:', error);
        res.status(500).json({ message: 'Failed to fetch guest logs' });
    }
});



module.exports = router;
