const express = require('express');
const router = express.Router();
const {
    trackOrder
} = require('../controllers/sendbirdControler');

router.post('/getOrders', trackOrder);

module.exports = router;