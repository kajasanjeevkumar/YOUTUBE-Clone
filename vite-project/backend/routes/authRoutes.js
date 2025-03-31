const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const cors = require("cors");

const router = express.Router();
router.use(cors()); // Allow requests from React frontend
// User Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Create new user
        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check password
        if(password!==user.password)
        {
            return res.status(400).json({ message: "Password is Wrong, Kindly check" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, "secretKey");

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;