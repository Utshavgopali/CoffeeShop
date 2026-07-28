import Cart, { ICart } from "../models/cart.model";

export async function getOrCreateCart(userId: string): Promise<ICart> {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await new Cart({ user: userId, items: [] }).save();
  return cart;
}
export async function saveCart(cart: ICart): Promise<ICart> { return cart.save(); }
export async function clearCart(userId: string): Promise<void> { await Cart.findOneAndUpdate({ user: userId }, { items: [] }); }