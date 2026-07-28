import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "user" | "admin";
  provider: "local" | "google";
  googleId?: string;
  passwordChangeCode?: string;
  passwordChangeCodeExpires?: Date;
  resetPasswordCode?: string;
  resetPasswordCodeExpires?: Date;
  resetPasswordVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, select: false },
    passwordChangeCode: { type: String, select: false },
    passwordChangeCodeExpires: { type: Date, select: false },
    resetPasswordCode: { type: String, select: false },
    resetPasswordCodeExpires: { type: Date, select: false },
    resetPasswordVerified: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);