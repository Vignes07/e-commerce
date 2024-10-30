const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user data to the request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired, please log in again' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
