const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Order = require("../models/orderSchema");

exports.trackOrder = async (req, res) => {
    const { userId, orderId } = req.params;
    // const { orderId } = req.body;

    try {
        const order = await Order.findOne({ userId: new ObjectId(userId)});

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

exports.createUser = async (req, res) => {
    const { userId, nickname, profile_url } = req.body;

    try {
        const checkUserResponse = await fetch(`https://api-EE6FCBB4-F083-485D-9FA4-478D7CFC41F6.sendbird.com/v3/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': process.env.SENDBIRD_API_TOKEN
            }
        });

        if (checkUserResponse.ok) {
            const existingUser = await checkUserResponse.json();
            console.log("User already exists:", existingUser);
            return res.status(200).json({ message: 'User already exists', user: existingUser });
        }

        const body = JSON.stringify({
            user_id: userId,
            nickname,
            profile_url
        });

        const createUserResponse = await fetch(`https://api-EE6FCBB4-F083-485D-9FA4-478D7CFC41F6.sendbird.com/v3/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': process.env.SENDBIRD_API_TOKEN,
                'Content-Length': body.length
            },
            body,
        });

        if (!createUserResponse.ok) {
            const errorData = await createUserResponse.json();
            return res.status(400).json({ message: 'Failed to create user', error: errorData });
        }

        const newUser = await createUserResponse.json();
        res.status(200).json(newUser);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Failed to create Sendbird user', error });
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

exports.sendbirdCredentials = async (req, res) => {
    res.json({
        appId: process.env.SENDBIRD_APP_ID,
        botId: process.env.SENDBIRD_BOT_ID,
    });
}
