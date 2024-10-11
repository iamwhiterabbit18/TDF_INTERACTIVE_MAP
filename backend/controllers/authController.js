//authController.js 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const loginUser = async (req, res) => {
    //console.log('JWT_SECRET:', process.env.JWT_SECRET); 
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

       /* Log admin login (Time In)
        if (user.role === 'admin') {
            const adminLog = new AdminLog({ adminName: user.name, timeIn: Date.now() });
            await adminLog.save();
        } */

        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging

        res.status(500).json({ message: 'Server error' });
    } 
};


module.exports = {
    loginUser
};