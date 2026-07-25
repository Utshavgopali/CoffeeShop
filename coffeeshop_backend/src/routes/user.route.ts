import {
  register, login, googleLogin, whoami,
  requestPasswordChange, confirmPasswordChange,
  forgotPasswordRequest, forgotPasswordVerify, forgotPasswordReset,
} from "../controllers/user.controller";

router.post("/google", googleLogin);
router.post("/forgot-password/request", forgotPasswordRequest);
router.post("/forgot-password/verify", forgotPasswordVerify);
router.post("/forgot-password/reset", forgotPasswordReset);
router.post("/change-password/request-code", protect, requestPasswordChange);
router.patch("/change-password/confirm", protect, confirmPasswordChange);