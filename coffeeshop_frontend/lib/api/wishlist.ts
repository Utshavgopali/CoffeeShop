import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";
import type { Bean } from "./beans";

export interface WishlistItem {
  _id: string;
  bean: Bean;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const res = await axiosInstance.get(ENDPOINTS.WISHLIST.LIST);
  return res.data.data;
}

export async function addToWishlist(beanId: string): Promise<void> {
  await axiosInstance.post(ENDPOINTS.WISHLIST.ADD(beanId));
}

export async function removeFromWishlist(beanId: string): Promise<void> {
  await axiosInstance.delete(ENDPOINTS.WISHLIST.DELETE(beanId));
}