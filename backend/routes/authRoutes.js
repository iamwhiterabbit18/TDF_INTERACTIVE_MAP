const express = require('express');
const router = express.Router();
const { loginUser, logoutUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your middleware

router.post('/login', loginUser); // No middleware needed for login, unless you want to protect it
router.post('/logout', authMiddleware(), logoutUser); // Apply middleware here for logout

module.exports = router;
