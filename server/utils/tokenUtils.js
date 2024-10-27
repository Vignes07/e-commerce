// middleware/tokenUtils.js
const jwt = require('jsonwebtoken');
const {User} = require('../models/userSchema.js');

const handleTokenRefresh = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            new Error("Invalid refresh token");
        }

        return jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'}
        );
    } catch (error) {
        throw error;
    }
};

module.exports = {handleTokenRefresh};
