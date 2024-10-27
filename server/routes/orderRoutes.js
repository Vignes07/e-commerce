const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrderedProducts
} = require('../controllers/orderController.js');

const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware, placeOrder);

router.get('/:userId', authMiddleware, getOrderedProducts);

module.exports = router;