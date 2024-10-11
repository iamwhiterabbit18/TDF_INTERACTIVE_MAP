//authController.js 
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const StaffLog = require('../models/StaffLog');
const GuestLog = require('../models/GuestLog');
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

            // Log admin or staff login time
            if (user.role === 'admin') {
                const adminLog = new AdminLog({ adminName: user.name });
                await adminLog.save();
            } else if (user.role === 'staff') {
                const staffLog = new StaffLog({ staffName: user.name });
                await staffLog.save();
            } else if (user.role === 'guest') {
                const guestLog = new GuestLog({ guestId: user._id });
                await guestLog.save();
}

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

const logoutUser = async (req, res) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role, name } = decoded;

        // Log out the user based on role and set the timeOut
        if (role === 'admin') {
            console.log('Logging out:', { role, name });

            await AdminLog.findOneAndUpdate(
                { adminName: name, timeOut: null }, // Ensure we are finding the right log entry
                { timeOut: new Date() } // Set the timeOut to the current date
            );
        } else if (role === 'staff') {
            console.log('Logging out:', { role, name });

            await StaffLog.findOneAndUpdate(
                { staffName: name, timeOut: null }, // Ensure we are finding the right log entry
                { timeOut: new Date() } // Set the timeOut to the current date
            );
        } else if (role === 'guest') {
            console.log('Logging out:', { role, name });

            await GuestLog.findOneAndUpdate(
                { guestId: decoded.id, timeOut: null }, // Ensure we are finding the right log entry
                { timeOut: new Date() } // Set the timeOut to the current date
            );
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    loginUser,
    logoutUser, // Add the logout function here
};