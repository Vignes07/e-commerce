const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orders: [
        {
            productId: { type: Number, required: true }, // Product identifier
            quantity: { type: Number, required: true },
            deliveryDate: { type: Date, required: true },  // Unique delivery date per product
            shippingData: { type: Object, required: true },
            totalPrice: { type: Number, required: true },
            paidAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Order", orderSchema);
