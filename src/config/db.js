const mongoose = require("mongoose");


const MONGO_CONNECTION_STRING = "mongodb+srv://agarwalsanyam150_db_user:Bdcoe2451@cluster0.uxho91l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    // Use the hardcoded string
    const conn = await mongoose.connect(MONGO_CONNECTION_STRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
