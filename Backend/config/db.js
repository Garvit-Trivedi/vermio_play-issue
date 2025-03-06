const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err; // Let the app handle the error instead of exiting
  }
};

module.exports = connectDB;
