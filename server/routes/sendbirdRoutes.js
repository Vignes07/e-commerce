const express = require('express');
const router = express.Router();
const { trackOrder, issueSessionToken, createUser, sendbirdCredentials} = require('../controllers/sendbirdControler');

router.post('/issue-session-token', issueSessionToken);
router.post('/track-order/:userId', trackOrder);
router.post('/create-user', createUser);
router.get('/sendbird-credentials', sendbirdCredentials)

module.exports = router;
