const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Order = require("../models/orderSchema");

exports.trackOrder = async (req, res) => {
    const { userId, orderId } = req.body;

    try {
        const order = await Order.findOne({ userId: new ObjectId(userId), 'orders._id': orderId });

        if (order) {
            const selectedOrder = order.orders.find(o => o._id.toString() === orderId);
            res.json(selectedOrder || { message: "Order not found" });
        } else {
            res.status(404).json({ message: "No orders found for this user" });
        }
    } catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.issueSessionToken = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)
    const appId = process.env.SENDBIRD_APP_ID;
    const apiToken = process.env.SENDBIRD_API_TOKEN;
    const url = `https://api-${appId}.sendbird.com/v3/users/${userId}/token`;
    const expiryDuration = 10 * 60 * 1000;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': apiToken,
            },
            body: JSON.stringify({ expires_at: Date.now() + expiryDuration }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to issue session token');
        }

        res.json({ token: data.token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
