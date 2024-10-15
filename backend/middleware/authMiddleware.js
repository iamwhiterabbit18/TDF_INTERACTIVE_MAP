// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', ''); // Check for the Authorization header
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log("Decoded Token:", decoded);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (err) {
            console.error('Token verification error:', err);
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};

module.exports = authMiddleware;
