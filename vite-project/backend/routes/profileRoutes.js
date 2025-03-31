const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Video = require("../models/videos");
const cors = require("cors");

router.use(cors()); // Allow requests from React frontend

// ➡️ Get Videos by User ID
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    let query = {};
    
    // 🔥 Convert the ID properly
    if (mongoose.Types.ObjectId.isValid(userId)) {
        query.userId = new mongoose.Types.ObjectId(userId);
    } else {
        query.userId = userId;  // Use string if not ObjectId
    }

    try {
        const videos = await Video.find(query);


        res.status(200).json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ➡️ Get Videos by User ID
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    let query = {};
    
    // If the userId is a valid ObjectId, convert it, otherwise use string
    if (mongoose.Types.ObjectId.isValid(userId)) {
        query.userId = new mongoose.Types.ObjectId(userId);
    } else {
        query.userId = userId;  // Use string if not ObjectId
    }

    const videos = await Video.find(query);
    res.json(videos);
});

// ➡️ Edit Existing Video
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, category, thumbnailUrl, videoUrl } = req.body;

    try {
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { title, description, category, thumbnailUrl, videoUrl },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).send("Video not found");
        }

        res.json(updatedVideo);
    } catch (error) {
        console.error("Error editing video:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
