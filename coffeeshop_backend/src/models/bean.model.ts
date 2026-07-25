import mongoose, { Schema, type Document } from "mongoose";

export interface IBean extends Document {
  name: string; description: string; origin: string;
  roastLevel: "light" | "medium" | "medium-dark" | "dark";
  process: "washed" | "natural" | "honey" | "anaerobic";
  category: "single-origin" | "blend" | "decaf" | "espresso";
  tastingNotes: string[]; weightGrams: number; price: number; stock: number;
  images: string[]; featured: boolean; createdBy: mongoose.Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}

const beanSchema = new Schema<IBean>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    origin: { type: String, required: true },
    roastLevel: { type: String, enum: ["light", "medium", "medium-dark", "dark"], required: true },
    process: { type: String, enum: ["washed", "natural", "honey", "anaerobic"], default: "washed" },
    category: { type: String, enum: ["single-origin", "blend", "decaf", "espresso"], default: "single-origin" },
    tastingNotes: { type: [String], default: [] },
    weightGrams: { type: Number, required: true, default: 250 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

beanSchema.index({ name: "text", origin: "text", tastingNotes: "text" });
export default mongoose.model<IBean>("Bean", beanSchema);