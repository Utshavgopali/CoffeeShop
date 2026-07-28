import mongoose, { Schema, type Document } from "mongoose";

export interface ICartItem { bean: mongoose.Types.ObjectId; quantity: number; }
export interface ICart extends Document { user: mongoose.Types.ObjectId; items: ICartItem[]; updatedAt: Date; }

const cartItemSchema = new Schema<ICartItem>(
  { bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true }, quantity: { type: Number, required: true, min: 1, default: 1 } },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  { user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, items: { type: [cartItemSchema], default: [] } },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);