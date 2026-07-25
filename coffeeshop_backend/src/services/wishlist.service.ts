import { addToWishlist, removeFromWishlist, getWishlistByUser } from "../repositories/wishlist.repository";

export async function addToWishlistService(userId: string, beanId: string) { return addToWishlist(userId, beanId); }
export async function removeFromWishlistService(userId: string, beanId: string) { return removeFromWishlist(userId, beanId); }
export async function getWishlistService(userId: string) { return getWishlistByUser(userId); }