//userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Add a new user
const addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,  // Save hashed password
            role,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add user' });
    }
};

// Get all users
const getUsers = async (req, res) => {
    console.log("GET /all route hit");
    try {
        const users = await User.find();
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Update an existing user
const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let updateData = { name, email, role };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };
