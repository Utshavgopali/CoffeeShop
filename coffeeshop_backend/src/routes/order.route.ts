import { Router } from "express";
import { protect } from "../middleware/auth";
import { checkout, verifyPayment, myOrders, getOrder } from "../controllers/order.controller";

const router = Router();

router.use(protect);

router.post("/checkout", checkout);
router.get("/verify", verifyPayment);
router.get("/", myOrders);
router.get("/:id", getOrder);

export default router;