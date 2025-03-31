const mongoose = require("mongoose");
const Video = require("./models/videos"); // Import Video model
const videos=require("./videoData.json");
const User=require("./models/users");

mongoose.connect('mongodb://localhost:27017/youtube');
const db=mongoose.connection;
db.on("open",()=>{
    console.log("✅ Connection success");
});
db.on("error",()=>{
    console.log("❌ Connection failed");
});

// Insert Dummy Data
async function seedDatabase() {
  try {
    //1. Clear Existing Data
    await Video.deleteMany();
    await User.deleteMany();

     // 2. Create Dummy Users
     const users = await User.insertMany([
      { name: "Rahul", email: "rahul@gmail.com", password: "1234" },
      { name: "Sanjeev", email: "sanjeev@gmail.com", password: "1234" },
      { name: "Bob", email: "bob@gmail.com", password: "1234" },
    ]);

    // 3. Map old `userId` to new MongoDB IDs
    const userMap = {};
    users.forEach((user, index) => {
      userMap[`user0${index + 1}`] = user._id;  // e.g., "user01" -> Mongo ID
    });

    // 4. Replace old `userId` with new MongoDB IDs in videos
    const updatedVideos = videos.map((video) => {
      if (userMap[video.userId]) {
        video.userId = userMap[video.userId]; // Map to new ID
      }
      return video;
    });

    // Insert videos with new user IDs
    await Video.insertMany(updatedVideos);
    console.log("✅ Dummy data inserted successfully");

    mongoose.connection.close(); // Close connection after inserting
  } catch (error) {
    console.error("❌ Error inserting data:", error);
  }
}

seedDatabase();
