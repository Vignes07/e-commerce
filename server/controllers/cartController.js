// controllers/cartController.js
const CartItem = require('../models/cartSchema.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.addToCart = async (req, res) => {
    const { userId, items } = req.body;

    try {
        let cart = await CartItem.findOne({ userId: new ObjectId(userId) });
        if (cart) {
            console.log("user found")
            items.forEach(newItem => {
                console.log("New item:", newItem);
                const existingItem = cart.items.find(item =>
                    Number(item.productId) === Number(newItem.productId)
                );
                if (existingItem) {
                    console.log("already exists")
                    existingItem.quantity += newItem.quantity;
                } else {
                    cart.items.push(newItem);
                }
            });
            await cart.save();
        } else {
            cart = new CartItem({ userId: new ObjectId(userId), items });
            await cart.save();
        }

        res.status(200).json({ message: 'Cart updated successfully', cart });
    }  catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};

exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await CartItem.findOne({ userId: new ObjectId(userId) });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Update item quantity in the cart
exports.updateCartItem = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    try {
        const cart = await CartItem.findOne({ userId: new ObjectId(userId) });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId === productId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
            res.status(200).json({ message: 'Item updated successfully', cart });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    const { userId, productId } = req.params;

    console.log(userId)
    console.log(productId)

    try {
        const cart = await CartItem.findOne({ userId: new ObjectId(userId) });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId !== Number(productId));
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item', error: error.message });
    }
};
