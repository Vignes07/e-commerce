const express = require('express');
const router = express.Router();
const {
    trackOrder
} = require('../controllers/sendbirdControler');

router.post('sendbird/getOrders/', trackOrder);

module.exports = router;