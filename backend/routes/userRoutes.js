//userRoutes.js
const express = require('express');
const { getUsers, addUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Route to get all users
router.get('/all', getUsers);

// Other routes (if any)
router.post('/add', addUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
