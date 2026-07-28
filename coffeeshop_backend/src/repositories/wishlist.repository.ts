import Wishlist, { IWishlist } from "../models/wishlist.model";

export async function addToWishlist(userId: string, beanId: string): Promise<IWishlist> {
  return Wishlist.findOneAndUpdate({ user: userId, bean: beanId }, { user: userId, bean: beanId }, { upsert: true, new: true });
}
export async function removeFromWishlist(userId: string, beanId: string): Promise<void> {
  await Wishlist.findOneAndDelete({ user: userId, bean: beanId });
}
export async function getWishlistByUser(userId: string): Promise<IWishlist[]> {
  return Wishlist.find({ user: userId }).populate("bean");
}