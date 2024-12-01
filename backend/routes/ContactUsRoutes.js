// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ContactUs = require('../models/ContactUs');

// Get Contact Us data
router.get('/', async (req, res) => {
    try {
        const contactInfo = await ContactUs.findOne();
        res.json(contactInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Contact Us details
router.put('/', async (req, res) => {
    const { location, telephone, email, facebookPage } = req.body;

    // Check if any field is missing
    if (!location || !telephone || !email || !facebookPage) {
        return res.status(400).json({ message: 'All fields (location, telephone, email, facebookPage) are required.' });
    }

    try {
        let contactUs = await ContactUs.findOne();
        if (!contactUs) {
            // If Contact Us record does not exist, create a new one
            contactUs = new ContactUs({ location, telephone, email, facebookPage });
        } else {
            // Check if there's any change before updating
            const changes = { location, telephone, email, facebookPage };

            const hasChanges = Object.keys(changes).some(
                (key) => contactUs[key] !== changes[key]
            );

            if (!hasChanges) {
                return res.status(400).json({ message: 'No changes detected in the data.' });
            }

            // If there are changes, update the Contact Us data
            contactUs.location = location;
            contactUs.telephone = telephone;
            contactUs.email = email;
            contactUs.facebookPage = facebookPage;
        }

        await contactUs.save();
        res.json(contactUs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
