const Order = require("../models/orderSchema.js");
const Cart = require("../models/cartSchema.js");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

exports.placeOrder = async (req, res) => {
    try {
        const { userId, orderedProducts, shippingData, totalPrice } = req.body;

        const updatedOrders = orderedProducts.map((product) => {
            const randomDays = Math.floor(Math.random() * 5) + 3; // Random days between 3 and 7
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + randomDays); // Calculate unique delivery date for each product

            return {
                orderId: new mongoose.Types.ObjectId().toString(), // Unique ID per product
                productId: product.productId,
                quantity: product.quantity,
                deliveryDate: deliveryDate, // Assign the unique delivery date
                shippingData,
                totalPrice,
            };
        });

        const order = await Order.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) },
            { $push: { orders: { $each: updatedOrders } } },
            { upsert: true, new: true }
        );

        await Cart.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) },
            { items: [] }
        );

        res.status(201).json({ success: true, order });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ success: false, message: "An error occurred while placing the order.", error: err.message });
    }
};

exports.getOrderedProducts = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.findOne({ userId: new ObjectId(userId) });

        console.log(orders)

        if (orders && orders.orders.length > 0) {
            // const orderedProducts = orders.orders.reduce((accumulator, order) => {
            //     accumulator.push(...order.orderedProducts);
            //     return accumulator;
            // }, []);
            res.send(orders.orders);
        } else {
            res.status(404).json({ message: "No products found" });
        }
    } catch (err) {
        console.error("Error fetching ordered products:", err); // Log detailed error
        res.status(500).json({ message: "An error occurred while fetching ordered products.", error: err.message });
    }
};




