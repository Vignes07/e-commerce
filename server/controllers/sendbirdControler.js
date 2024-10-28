const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Order = require("../models/orderSchema");

exports.trackOrder = async (req, res) => {
    const { userId } = req.body; // Get userId and authToken from the request body

    try {
        // // Verify the token using the provided authToken
        // const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        // req.user = decoded; // You can still attach user data if needed
        //
        // // Optionally, you can check if the decoded userId matches the sent userId
        // if (decoded.userId !== userId) {
        //     return res.status(403).json({ message: 'User ID does not match, authorization denied' });
        // }

        const orders = await Order.findOne({ userId: new ObjectId(userId) });

        console.log(orders);

        if (orders && orders.orders.length > 0) {
            res.send(orders.orders);
        } else {
            res.status(404).json({ message: "No products found" });
        }
    } catch (err) {
        console.error("Error verifying token:", err); // Log detailed error
        return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};