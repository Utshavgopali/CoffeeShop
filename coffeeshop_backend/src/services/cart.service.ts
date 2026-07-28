import { getOrCreateCart, saveCart, clearCart } from "../repositories/cart.repository";
import { findBeanById } from "../repositories/bean.repository";
import type { ICart } from "../models/cart.model";

export async function getCartService(userId: string): Promise<ICart> {
  const cart = await getOrCreateCart(userId);
  return cart.populate("items.bean");
}

export async function addToCartService(userId: string, beanId: string, quantity: number): Promise<ICart> {
  const bean = await findBeanById(beanId);
  if (!bean) throw new Error("Coffee bean not found");
  if (bean.stock < quantity) throw new Error("Not enough stock available");
  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((i) => String(i.bean) === beanId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ bean: bean._id as any, quantity });
  await saveCart(cart);
  return cart.populate("items.bean");
}

export async function updateCartItemService(userId: string, beanId: string, quantity: number): Promise<ICart> {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => String(i.bean) === beanId);
  if (!item) throw new Error("Item not in cart");
  if (quantity <= 0) cart.items = cart.items.filter((i) => String(i.bean) !== beanId) as any;
  else item.quantity = quantity;
  await saveCart(cart);
  return cart.populate("items.bean");
}

export async function removeFromCartService(userId: string, beanId: string): Promise<ICart> {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => String(i.bean) !== beanId) as any;
  await saveCart(cart);
  return cart.populate("items.bean");
}

export async function clearCartService(userId: string): Promise<void> { await clearCart(userId); }