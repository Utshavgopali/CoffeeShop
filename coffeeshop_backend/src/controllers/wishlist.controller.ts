import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { addToWishlistService, removeFromWishlistService, getWishlistService } from "../services/wishlist.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

export async function addWishlistItem(req: Request<{ beanId: string }>, res: Response) {
  try { await addToWishlistService((req as any).user.id, req.params.beanId); return sendSuccess(res, null, "Added to wishlist"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 400); }
}
export async function deleteWishlistItem(req: Request<{ beanId: string }>, res: Response) {
  try { await removeFromWishlistService((req as any).user.id, req.params.beanId); return sendSuccess(res, null, "Removed from wishlist"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}
export async function getWishlist(req: Request, res: Response) {
  try { return sendSuccess(res, await getWishlistService((req as any).user.id), "Wishlist retrieved successfully"); }
  catch (error: any) { return sendError(res, error.message || "Internal server error", 500); }
}