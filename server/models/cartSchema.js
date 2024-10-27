// models/cartSchema.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [{
        productId: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }]
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
