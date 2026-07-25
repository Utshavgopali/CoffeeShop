import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model";
import Bean from "../models/bean.model";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/coffeeshop";
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    await Wishlist.syncIndexes();
    await Bean.syncIndexes();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}