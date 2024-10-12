//authController.js 
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const StaffLog = require('../models/StaffLog');
const GuestLog = require('../models/GuestLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');


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

        
        // Get current time and date in Asia/Shanghai timezone
        const now = moment.tz("Asia/Shanghai");
        const dateTimeIN = now.format("YYYY-MM-DD : h:mm A");
        const dateTimeOUT = null;
        
        let logId; // Variable to store log ID

        // Log admin or staff login time
        if (user.role === 'admin') {
            const adminLog = new AdminLog({ adminName: user.name, dateTimeIN ,dateTimeOUT});
            const savedLog = await adminLog.save();
            logId = savedLog._id; // Save the log ID
        } else if (user.role === 'staff') {
            const staffLog = new StaffLog({ staffName: user.name, dateTimeIN ,dateTimeOUT});
            const savedLog = await staffLog.save();
            logId = savedLog._id; // Save the log ID
        } else if (user.role === 'guest') {
            const guestLog = new GuestLog({ guestId: user._id, dateTimeIN ,dateTimeOUT});
            const savedLog = await guestLog.save();
            logId = savedLog._id; // Save the log ID
        }
        
        const token = jwt.sign( { id: user._id, role: user.role, name: user.name, logId }, process.env.JWT_SECRET,
            { expiresIn: '1d' } );

            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token,
            });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        console.error('Error generating JWT token:', error);
        res.status(500).json({ message: 'Server error' });
        return res.status(500).json({ message: 'Failed to generate token' });
        
    } 
};

const logoutUser = async (req, res) => {
    console.log("Logout attempt received");
    const authHeader = req.header('Authorization');
    console.log("Authorization header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        const { role, name, logId } = decoded; // Extract logId

        // Format logout date and time
        const now = moment.tz("Asia/Shanghai");
        const dateTimeOUT = now.format("YYYY-MM-DD, h:mm A");

        let updatedLog;
        if (role === 'admin') {
            updatedLog = await AdminLog.findByIdAndUpdate(
                logId, // Use logId to find the correct log
                { dateTimeOUT },
                { new: true }
            );
        } else if (role === 'staff') {
            updatedLog = await StaffLog.findByIdAndUpdate(
                logId, // Use logId to find the correct log
                { dateTimeOUT },
                { new: true }
            );
        } else if (role === 'guest') {
            updatedLog = await GuestLog.findByIdAndUpdate(
                logId, // Use logId to find the correct log
                { dateTimeOUT },
                { new: true }
            );
        }

        console.log("Updated Log:", updatedLog); // Log the result of the update


        if (!updatedLog) {
            return res.status(404).json({ message: 'Log entry not found' });
        }

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = { loginUser, logoutUser };