import mongoose, { Schema, type Document } from "mongoose";

export interface IOrderItem {
  bean: mongoose.Types.ObjectId;
  name: string;
  weightGrams: number;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number; // NPR
  status: "pending" | "paid" | "failed" | "cancelled";
  paymentMethod: "khalti";
  khaltiPidx?: string;
  khaltiTransactionId?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    city: string;
    street: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    bean: { type: Schema.Types.ObjectId, ref: "Bean", required: true },
    name: { type: String, required: true },
    weightGrams: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["khalti"], default: "khalti" },
    khaltiPidx: { type: String },
    khaltiTransactionId: { type: String },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);