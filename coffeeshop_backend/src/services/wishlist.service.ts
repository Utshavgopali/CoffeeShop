import { addToWishlist, removeFromWishlist, getWishlistByUser } from "../repositories/wishlist.repository";

export async function addToWishlistService(userId: string, beanId: string) { return addToWishlist(userId, beanId); }
export async function removeFromWishlistService(userId: string, beanId: string) { return removeFromWishlist(userId, beanId); }

// Beans can be deleted (e.g. by an admin) after a user has wishlisted them, leaving
// the populated `bean` field null — filter those out rather than returning broken rows.
export async function getWishlistService(userId: string) {
  const items = await getWishlistByUser(userId);
  return items.filter((item) => item.bean != null);
}