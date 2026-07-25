import { Router } from "express";
import { protect } from "../middleware/auth";
import { addWishlistItem, deleteWishlistItem, getWishlist } from "../controllers/wishlist.controller";
const router = Router();
router.use(protect);
router.get("/", getWishlist);
router.post("/:beanId", addWishlistItem);
router.delete("/:beanId", deleteWishlistItem);
export default router;