import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/logistics_db";
    await mongoose.connect(uri, { dbName: "logistics_db" });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

 const disconnectDB = async () => {
  await mongoose.disconnect();
};

export default connectDB;


