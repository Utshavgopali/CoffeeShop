import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";
import type { Bean } from "./beans";

export interface CartItem {
  bean: Bean;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export async function getCart(): Promise<Cart> {
  const res = await axiosInstance.get(ENDPOINTS.CART.GET);
  return res.data.data;
}

export async function addToCart(beanId: string, quantity = 1): Promise<Cart> {
  const res = await axiosInstance.post(ENDPOINTS.CART.ADD, { beanId, quantity });
  return res.data.data;
}

export async function updateCartItem(beanId: string, quantity: number): Promise<Cart> {
  const res = await axiosInstance.put(ENDPOINTS.CART.UPDATE(beanId), { quantity });
  return res.data.data;
}

export async function removeFromCart(beanId: string): Promise<Cart> {
  const res = await axiosInstance.delete(ENDPOINTS.CART.REMOVE(beanId));
  return res.data.data;
}