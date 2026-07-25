import { Router } from "express";
import { register, login, logout, getMe, update } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", register);
router.post("/login",    login);

// Protected routes — authenticate runs first on every one of these.
router.post("/logout", authenticate, logout);
router.get( "/whoami", authenticate, getMe);
router.patch(
  "/update",
  authenticate,  // 1. must be logged in
  uploadAvatar,  // 2. parse optional avatar image (multer)
  update         // 3. update profile or change password
);

export default router;
