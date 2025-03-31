const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = () => {
    mongoose.connect('mongodb://localhost:27017/youtube');

    const db = mongoose.connection;
    db.on("open", () => {
        console.log("Connection success");
    });
    db.on("error", () => {
        console.log("Connection failed");
    });
};

module.exports = connectDB; // ✅ Exporting as a function
