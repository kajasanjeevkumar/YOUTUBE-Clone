const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  userName:{type:String,default:"Sanjeev"},
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  category: String,
  thumbnailUrl: String,
  videoUrl: String,
  description: String,
  userId:String,
  uploader: String,
  views: Number,
  likes: Number,
  dislikes: Number,
  uploadDate: Date,
  comments: [commentSchema]
});

module.exports = mongoose.model("Video", videoSchema);
