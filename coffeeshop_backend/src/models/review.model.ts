import mongoose, { Schema, type Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  bean: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, bean: 1 }, { unique: true });
reviewSchema.index({ bean: 1, createdAt: -1 });

export default mongoose.model<IReview>("Review", reviewSchema);
