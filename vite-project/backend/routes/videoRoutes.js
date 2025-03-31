const express = require("express");
const connectDB=require("../config/db");
const cors = require("cors");
const Video=require("../models/videos");
const { v4: uuidv4 } = require("uuid"); // For unique comment IDs

const router = express.Router();
router.use(express.json()); // Enable JSON parsing
router.use(cors()); // Allow requests from React frontend
//Connect to mongoose
connectDB();
//fetch all videos to home page
router.get("/",async(req,res)=>{
    try{
        const videos=await Video.find();
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
      }
});
//get certain video with id
router.get("/:id", async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: req.params.id });
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        res.json(video);
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Like a video
router.post("/:videoId/like", async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: req.params.videoId });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        video.likes += 1;    // Increment like count
        await video.save();

        res.json({ likes: video.likes, dislikes: video.dislikes });
    } catch (error) {
        res.status(500).json({ message: "Failed to like the video" });
    }
});

// Dislike a video
router.post("/:videoId/dislike", async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: req.params.videoId });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        video.dislikes += 1;   // ✅ Increment dislike count
        await video.save();

        res.json({ likes: video.likes, dislikes: video.dislikes });
    } catch (error) {
        res.status(500).json({ message: "Failed to dislike the video" });
    }
});

//Add new comment
router.post("/:id/comments",async (req, res) => {
    const { userId, userName, text } = req.body;
    try {
        const video = await Video.findOne({ videoId: req.params.id });
        if(video===undefined||video===null)
        {
            console.log("Not found");
        }
        if (!video) return res.status(404).send("Video not found");
        const newComment = {
            commentId: uuidv4(),    // Generate unique ID
            userId,
            userName,
            text,
            timestamp: new Date()
        };
        video.comments.push(newComment);
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
//Edit comment
router.put("/:videoId/comments/:commentId", async (req, res) => {
    const { text } = req.body;
    
    try {
        const video = await Video.findOne({ videoId: req.params.videoId });
        if (!video) return res.status(404).send("Video not found");

        const comment = video.comments.find(c => c.commentId === req.params.commentId);
        if (!comment) return res.status(404).send("Comment not found");

        comment.text = text;
        comment.timestamp = new Date();
        console.log(comment);
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
//Delete a comment
router.delete("/:videoId/comments/:commentId", async (req, res) => {
    try {
        const video = await Video.findOne({ videoId: req.params.videoId });
        if (!video) return res.status(404).send("Video not found");

        video.comments = video.comments.filter(
            (c) => c.commentId !== req.params.commentId
        );
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports=router;