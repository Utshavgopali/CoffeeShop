import { Router } from "express";
import { protect } from "../../middleware/auth";
import { adminOnly } from "../../middleware/admin";
import { listOrders } from "../../controllers/admin/order.controller";

const router = Router();

router.use(protect, adminOnly);

router.get("/", listOrders);

export default router;