const express = require('express');
const router = express.Router();
const { trackOrder, issueSessionToken } = require('../controllers/sendbirdControler');

router.post('/issue-session-token', issueSessionToken);
router.post('/track-order', trackOrder);

module.exports = router;
