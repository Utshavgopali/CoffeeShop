import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../database/mongodb";
import User from "../models/user.model";

dotenv.config();

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make-admin -- <email>");
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { $set: { role: "admin" } },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email ${email}. Register the account first, then run this script.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`${user.email} is now an admin.`);
  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin().catch((error) => {
  console.error("Failed to promote user:", error);
  process.exit(1);
});
