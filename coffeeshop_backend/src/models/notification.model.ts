import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; title: string; message: string; type: "order" | "account" | "system"; read: boolean; createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "account", "system"], default: "system" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);