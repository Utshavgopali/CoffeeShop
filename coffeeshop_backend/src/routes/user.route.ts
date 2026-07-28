import { Router } from "express";
import { protect } from "../middleware/auth";
import { uploadAvatar } from "../middleware/uploads";
import {
  register, login, googleLogin, whoami, updateProfile,
  requestPasswordChange, confirmPasswordChange,
  forgotPasswordRequest, forgotPasswordVerify, forgotPasswordReset,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/whoami", protect, whoami);
router.put("/update", protect, uploadAvatar.single("avatar"), updateProfile);
router.post("/google", googleLogin);
router.post("/forgot-password/request", forgotPasswordRequest);
router.post("/forgot-password/verify", forgotPasswordVerify);
router.post("/forgot-password/reset", forgotPasswordReset);
router.post("/change-password/request-code", protect, requestPasswordChange);
router.patch("/change-password/confirm", protect, confirmPasswordChange);

export default router;
