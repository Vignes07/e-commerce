// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} = require('../controllers/cartController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // Include this if you have authentication

// Add items to cart or update cart
router.post('/', authMiddleware, addToCart);

// Get the user's cart
router.get('/:userId', authMiddleware, getCart);

// Update item quantity in the car
router.put('/:userId', authMiddleware, updateCartItem);

// Remove item from cart
router.delete('/:userId/:productId', authMiddleware, removeCartItem);

module.exports = router;
