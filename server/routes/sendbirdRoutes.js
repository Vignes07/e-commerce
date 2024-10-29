const express = require('express');
const router = express.Router();
const { trackOrder, issueSessionToken } = require('../controllers/sendbirdControler');

router.post('/issue-session-token', issueSessionToken);
router.post('/track-order', trackOrder);

router.post('/create-user', async (req, res) => {
    const { userId, nickname } = req.body;
    console.log(userId, nickname);
    try {
        const body = JSON.stringify({
            user_id: userId,
            nickname,
            profile_url: "https://example.com/default-profile.png"
        });
        const response = await fetch(`https://api-EE6FCBB4-F083-485D-9FA4-478D7CFC41F6.sendbird.com/v3/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Token': process.env.SENDBIRD_API_TOKEN,
                'Content-Length': body.length
            },
            body,
        });
        console.log("res:" ,response)
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(400).json(errorData);
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to create Sendbird user1', error });
    }
});

module.exports = router;
