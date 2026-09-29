const mongoose = require("mongoose");
const config = require("./env");

const connectDB = async () => {
  if (!config.mongodbUri) {
    console.error("MongoDB connection error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongodbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;