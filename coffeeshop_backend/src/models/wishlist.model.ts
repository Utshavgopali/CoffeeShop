import mongoose, { Schema, type Document } from "mongoose";

export interface IWishlist extends Document { user: mongoose.Types.ObjectId; bean: mongoose.Types.ObjectId; createdAt: Date; }

const wishlistSchema = new Schema<IWishlist>(
  { user: { type: Schema.Types.ObjectId, ref: "User", required: true }, bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true } },
  { timestamps: true }
);
wishlistSchema.index({ user: 1, bean: 1 }, { unique: true });

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);