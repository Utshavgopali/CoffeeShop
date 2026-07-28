import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { registerService, loginService } from "../services/user.service";
import { RegisterSchema, LoginSchema } from "../types/user.type";
import User from "../models/user.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

function firstIssue(parsed: any) { return parsed.error?.issues?.[0]?.message || "Validation failed"; }

export async function register(req: Request, res: Response) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const result = await registerService(parsed.data);
    return sendSuccess(res, result, "Registered successfully", 201);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const result = await loginService(parsed.data);
    return sendSuccess(res, result, "Logged in successfully");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

export async function whoami(req: Request, res: Response) {
  try {
    const user = await User.findById((req as any).user.id).select("-password");
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  googleLoginService, forgotPasswordRequestService, forgotPasswordVerifyService, forgotPasswordResetService,
  updateProfileService,
} from "../services/user.service";
import {
  GoogleLoginSchema, RequestPasswordChangeSchema, ConfirmPasswordChangeSchema,
  ForgotPasswordRequestSchema, ForgotPasswordVerifySchema, ForgotPasswordResetSchema,
  UpdateProfileSchema,
} from "../types/user.type";
import { sendPasswordChangeCode } from "../utils/mailer";

export async function googleLogin(req: Request, res: Response) {
  try {
    const parsed = GoogleLoginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const result = await googleLoginService(parsed.data.idToken);
    return sendSuccess(res, result, "Logged in with Google");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Google sign-in failed", 400);
  }
}

export async function requestPasswordChange(req: Request, res: Response) {
  try {
    const parsed = RequestPasswordChangeSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const user = await User.findById((req as any).user.id).select("+password +passwordChangeCode +passwordChangeCodeExpires");
    if (!user || !user.password) return sendError(res, "Password login is not set up for this account", 400);
    const isMatch = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!isMatch) return sendError(res, "Current password is incorrect", 400);
    const code = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    user.passwordChangeCode = await bcrypt.hash(code, salt);
    user.passwordChangeCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendPasswordChangeCode(user.email, code);
    return sendSuccess(res, null, `Verification code sent to ${user.email}`);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

export async function confirmPasswordChange(req: Request, res: Response) {
  try {
    const parsed = ConfirmPasswordChangeSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    const user = await User.findById((req as any).user.id).select("+passwordChangeCode +passwordChangeCodeExpires");
    if (!user) return sendError(res, "User not found", 404);
    if (!user.passwordChangeCode || !user.passwordChangeCodeExpires) return sendError(res, "No pending code. Please request a new one.", 400);
    if (user.passwordChangeCodeExpires.getTime() < Date.now()) return sendError(res, "This code has expired. Please request a new one.", 400);
    const codeMatches = await bcrypt.compare(parsed.data.code, user.passwordChangeCode);
    if (!codeMatches) return sendError(res, "Invalid verification code", 400);
    user.password = await bcrypt.hash(parsed.data.newPassword, 10);
    user.passwordChangeCode = undefined;
    user.passwordChangeCodeExpires = undefined;
    await user.save();
    return sendSuccess(res, null, "Password updated successfully");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);

    const updateData: Record<string, any> = { ...parsed.data };
    if ((req as any).file) {
      updateData.avatar = `/avatars/${(req as any).file.filename}`;
    }

    const user = await updateProfileService((req as any).user.id, updateData);
    return sendSuccess(res, user, "Profile updated successfully");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

export async function forgotPasswordRequest(req: Request, res: Response) {
  try {
    const parsed = ForgotPasswordRequestSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    await forgotPasswordRequestService(parsed.data.email);
    return sendSuccess(res, null, "If that email is registered, a code has been sent to it.");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

export async function forgotPasswordVerify(req: Request, res: Response) {
  try {
    const parsed = ForgotPasswordVerifySchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    await forgotPasswordVerifyService(parsed.data.email, parsed.data.code);
    return sendSuccess(res, null, "Code verified. You can now set a new password.");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Invalid or expired code", 400);
  }
}

export async function forgotPasswordReset(req: Request, res: Response) {
  try {
    const parsed = ForgotPasswordResetSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);
    await forgotPasswordResetService(parsed.data.email, parsed.data.code, parsed.data.newPassword);
    return sendSuccess(res, null, "Password reset successfully. You can now log in.");
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 400);
  }
}

