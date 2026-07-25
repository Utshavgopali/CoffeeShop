import { Router } from "express";
import { register, login, whoami } from "../controllers/user.controller";
import { protect } from "../middleware/auth";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/whoami", protect, whoami);
export default router;