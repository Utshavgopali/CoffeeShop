import { Router } from "express";
import { protect } from "../../middleware/auth";
import { adminOnly } from "../../middleware/admin";
import { broadcastNotification } from "../../controllers/admin/notification.controller";

const router = Router();

router.use(protect, adminOnly);

router.post("/broadcast", broadcastNotification);

export default router;