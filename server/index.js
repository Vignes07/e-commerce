const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database.js');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const sendbirdRoutes = require('./routes/sendbirdRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB().then(() => console.log("DB connected"));

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/sendbird', sendbirdRoutes);

app.get('/api/sendbird-credentials', (req, res) => {
    res.json({
        appId: process.env.SENDBIRD_APP_ID,
        botId: process.env.SENDBIRD_BOT_ID,
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
