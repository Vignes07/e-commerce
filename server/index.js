const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database.js');
const authRoutes = require('./routes/authRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000',
// }));
app.use(cors());

connectDB().then(() => console.log("DB connected"));

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
