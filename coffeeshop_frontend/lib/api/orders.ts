import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  street: string;
}

export interface OrderItem {
  bean: string;
  name: string;
  weightGrams: number;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export async function checkout(shippingAddress: ShippingAddress): Promise<{ order: Order; paymentUrl: string; pidx: string }> {
  const res = await axiosInstance.post(ENDPOINTS.ORDERS.CHECKOUT, shippingAddress);
  return res.data.data;
}

export async function verifyPayment(pidx: string): Promise<Order> {
  const res = await axiosInstance.get(ENDPOINTS.ORDERS.VERIFY, { params: { pidx } });
  return res.data.data;
}

export async function myOrders(): Promise<Order[]> {
  const res = await axiosInstance.get(ENDPOINTS.ORDERS.LIST);
  return res.data.data;
}