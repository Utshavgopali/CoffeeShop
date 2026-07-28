import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { getCartService, addToCartService, updateCartItemService, removeFromCartService, clearCartService } from "../services/cart.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

export async function getCart(req: Request, res: Response) {
  try { return sendSuccess(res, await getCartService((req as any).user.id)); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}
export async function addToCart(req: Request, res: Response) {
  try {
    const { beanId, quantity } = req.body;
    if (!beanId) return sendError(res, "beanId is required", 400);
    return sendSuccess(res, await addToCartService((req as any).user.id, beanId, Number(quantity) || 1), "Added to cart");
  } catch (error: any) { return sendError(res, error.message || "Internal server error", 400); }
}
export async function updateCartItem(req: Request<{ beanId: string }>, res: Response) {
  try { return sendSuccess(res, await updateCartItemService((req as any).user.id, req.params.beanId, Number(req.body.quantity)), "Cart updated"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 400); }
}
export async function removeFromCart(req: Request<{ beanId: string }>, res: Response) {
  try { return sendSuccess(res, await removeFromCartService((req as any).user.id, req.params.beanId), "Removed from cart"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}
export async function clearCart(req: Request, res: Response) {
  try { await clearCartService((req as any).user.id); return sendSuccess(res, null, "Cart cleared"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}