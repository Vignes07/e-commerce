const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Order = require("../models/orderSchema");

exports.trackOrder = async (req, res) => {
    const { userId, orderId } = req.body; // Get userId and authToken from the request body

    console.log(userId, orderId);

    try {

        const orders = await Order.findOne({ userId: new ObjectId(userId) });

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