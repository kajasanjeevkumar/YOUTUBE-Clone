const express = require("express");

const app = express();
app.use(express.json()); // Enable JSON parsing

//Authorization
app.use("/api/auth",require("./routes/authRoutes"));
//Videos
app.use("/api/videos",require("./routes/videoRoutes"));
//Profile
app.use("/api/profile", require("./routes/profileRoutes"));  


app.listen(5000, () => console.log("🚀 Server running on port 5000"));