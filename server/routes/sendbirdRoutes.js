const express = require('express');
const router = express.Router();
const {
    trackOrder
} = require('../controllers/sendbirdControler');

router.post('/getOrders/:userId/:orderId', trackOrder);

module.exports = router;