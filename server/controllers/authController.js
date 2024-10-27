const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema.js');

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "No record existed" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '5h' });
            return res.status(200).json({ message: "Success", token, user });
        } else {
            return res.status(401).json({ message: "The password is incorrect" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Signup function
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", user: { email: newUser.email, _id: newUser._id } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
